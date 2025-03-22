import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Auth, updateProfile, signOut, User } from '@angular/fire/auth';
import { Firestore, collection, addDoc, doc, getDoc, collectionData, updateDoc, deleteDoc, docData, setDoc } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HeaderComponent } from "../header/header.component";
import { SpendingTrendsComponent } from '../spending-trends/spending-trends.component';

interface Subscription {
  id?: string;
  service_name: string;
  amount: number;
  renewal_date: string;
  next_payment_date: string;
  subscriptionType: string;
  purchaseDate: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent, SpendingTrendsComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userEmail: string = '';
  userName: string = 'User';
  isEditingProfile = false;
  serviceName: string = '';
  amount: number = 0;
  renewalDate: string = '';
  subscriptions: Observable<Subscription[]> | undefined;
  subscriptionType: string = '';
  purchaseDate: string = '';
  isEditMode = false;
  currentSubscriptionId: string | null = null;
  private subscription$: any;

  constructor(private auth: Auth, private firestore: Firestore, private router: Router) {}

  ngOnInit() {
    this.getUserDetails();
    this.loadSubscriptions();
  }

  /** Fetch logged-in user's details */
  async getUserDetails() {
    const user = this.auth.currentUser;
    if (user) {
      this.userEmail = user.email ?? '';

      // Fetch user data from Firestore
      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        this.userName = userData['name'] ?? 'User';
      } else {
        console.warn('User document not found in Firestore. Creating one...');

        // If user doc is missing, create a new one
        await setDoc(userDocRef, {
          name: user.displayName || 'User',
          email: user.email,
          createdAt: new Date()
        });

        this.userName = user.displayName || 'User';
      }
    }
  }



  /** Toggle profile edit mode */
  toggleEditProfile() {
    this.isEditingProfile = !this.isEditingProfile;
  }

  /** Save updated profile name */
  async saveProfile() {
    const user = this.auth.currentUser;
    if (user) {
      try {
        await updateProfile(user, { displayName: this.userName });

        // Update name in Firestore
        const userDocRef = doc(this.firestore, `users/${user.uid}`);
        await updateDoc(userDocRef, { name: this.userName });

        // console.log('Profile updated successfully!');
        this.isEditingProfile = false;
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  }

  /** Load subscriptions from Firestore */
  loadSubscriptions() {
    // const user = this.auth.currentUser;
    // if (user) {
      this.auth.onAuthStateChanged((user) => {
        if (user) {
      const subscriptionsCollection = collection(this.firestore, `users/${user.uid}/subscriptions`);
      this.subscriptions = collectionData(subscriptionsCollection, { idField: 'id' }) as Observable<Subscription[]>;
        } else {
          console.error("User not authenticated!");
        }
      });
  }

  /** Add new subscription */
  async addSubscription() {
    const user = this.auth.currentUser;
    if (user) {
      const subscriptionsCollection = collection(this.firestore, `users/${user.uid}/subscriptions`);
      const purchaseDateObj = new Date(this.purchaseDate);
      const nextPaymentDate = this.calculateNextPayment(purchaseDateObj, this.subscriptionType);
      const renewalDate = nextPaymentDate; // Renewal date logic (same as next payment)

      try {
        await addDoc(subscriptionsCollection, {
          service_name: this.serviceName,
          amount: this.amount,
          subscription_type: this.subscriptionType,
          purchase_date: this.purchaseDate,
          next_payment_date: nextPaymentDate,
          renewal_date: renewalDate
        });

        this.resetForm();
      } catch (error) {
        console.error('Error adding subscription:', error);
      }
    } else {
      console.error('User is not authenticated');
    }
  }

  /** Edit existing subscription */
  editSubscription(subscriptionId: string) {
    this.isEditMode = true;
    this.currentSubscriptionId = subscriptionId;

    const user = this.auth.currentUser;
    if (user) {
      const subscriptionDoc = doc(this.firestore, `users/${user.uid}/subscriptions/${subscriptionId}`);

      if (this.subscription$) {
        this.subscription$.unsubscribe();
      }

      this.subscription$ = docData(subscriptionDoc).subscribe((subscription: any) => {
        if (subscription) {
          this.serviceName = subscription.service_name;
          this.amount = subscription.amount;
          this.subscriptionType = subscription.subscription_type;
          this.purchaseDate = subscription.purchase_date;
        }
      });
    }
  }

  /** Update subscription */
  async updateSubscription() {
    const user = this.auth.currentUser;
    if (user && this.currentSubscriptionId) {
      const subscriptionDoc = doc(this.firestore, `users/${user.uid}/subscriptions/${this.currentSubscriptionId}`);
      const purchaseDateObj = new Date(this.purchaseDate);
      const nextPaymentDate = this.calculateNextPayment(purchaseDateObj, this.subscriptionType);
      const renewalDate = nextPaymentDate;

      try {
        await updateDoc(subscriptionDoc, {
          service_name: this.serviceName,
          amount: this.amount,
          subscription_type: this.subscriptionType,
          purchase_date: this.purchaseDate,
          next_payment_date: nextPaymentDate,
          renewal_date: renewalDate
        });

        this.resetForm();
        this.isEditMode = false;
      } catch (error) {
        console.error('Error updating subscription:', error);
      }
    }
  }

  /** Confirm deletion of subscription */
  confirmDelete(subscriptionId: string) {
    if (confirm('Are you sure you want to delete this subscription?')) {
      this.deleteSubscription(subscriptionId);
    }
  }

  /** Delete subscription */
  async deleteSubscription(subscriptionId: string) {
    const user = this.auth.currentUser;
    if (user) {
      const subscriptionDoc = doc(this.firestore, `users/${user.uid}/subscriptions/${subscriptionId}`);

      try {
        await deleteDoc(subscriptionDoc);
        // console.log('Subscription deleted');
      } catch (error) {
        console.error('Error deleting subscription:', error);
      }
    }
  }

  /** Calculate next payment/renewal date */
  calculateNextPayment(purchaseDate: Date, subscriptionType: string): string {
    const nextDate = new Date(purchaseDate);

    if (subscriptionType === 'monthly') {
      nextDate.setMonth(nextDate.getMonth() + 1);
    } else if (subscriptionType === 'yearly') {
      nextDate.setFullYear(nextDate.getFullYear() + 1);
    }

    const year = nextDate.getFullYear();
    const month = String(nextDate.getMonth() + 1).padStart(2, '0');
    const day = String(nextDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /** Calculate total spending */
  calculateTotalSpending(subscriptions: Subscription[]): number {
    return subscriptions.reduce((total, sub) => total + sub.amount, 0);
  }

  /** Check if renewal is coming up */
  isRenewalComingUp(renewalDate: string): boolean {
    const today = new Date();
    const renewal = new Date(renewalDate);
    return (renewal.getTime() - today.getTime()) / (1000 * 3600 * 24) <= 7;
  }

  /** Reset form */
  resetForm() {
    this.isEditMode = false;
    this.currentSubscriptionId = null;
    this.serviceName = '';
    this.amount = 0;
    this.subscriptionType = '';
    this.purchaseDate = '';

    if (this.subscription$) {
      this.subscription$.unsubscribe();
      this.subscription$ = null;
    }
  }
  goToProfile() {
    this.router.navigate(['/profile']);
  }
}
