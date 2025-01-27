import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, addDoc, doc, getDocs, collectionData, updateDoc, deleteDoc, docData, Timestamp } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

interface Subscription {
  id?: string;  // Add the 'id' field (optional)
  service_name: string;
  amount: number;
  renewal_date: string;
  next_payment_date: string;
  subscriptionType: string; // Default to 'monthly'
  purchaseDate: string; // Date of Purchase
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  serviceName: string = '';
  amount: number = 0;
  renewalDate: string = '';
  subscriptions: Observable<Subscription[]> | undefined;
  subscriptionType: string = ''; // Default to 'monthly'
  purchaseDate: string = "monthly"; // Date of Purchase
  isCustomScheduleEnabled: boolean = false; // Whether custom schedule is enabled
customSchedule: string[] = []; // Array of custom payment dates
customDate: string = ''; // Date input for the custom schedule

  constructor(private auth: Auth, private firestore: Firestore) {}

  ngOnInit() {
    const user = this.auth.currentUser;
    if (user) {
      const subscriptionsCollection = collection(this.firestore, `users/${user.uid}/subscriptions`);
      this.subscriptions = collectionData(subscriptionsCollection, { idField: 'id' }) as Observable<Subscription[]>;
    }
  }

  addSubscription() {
    const user = this.auth.currentUser;
    if (user) {
      const subscriptionsCollection = collection(this.firestore, `users/${user.uid}/subscriptions`);

    console.log('Purchasing date::::', this.purchaseDate);


        // Parse the purchase date string to a Date object
        const purchaseDateObj = new Date(this.purchaseDate);
        console.log("Purchasing date::::", purchaseDateObj);


        // Calculate next payment and renewal dates
        const nextPaymentDate = this.calculateNextPayment(purchaseDateObj, this.subscriptionType);
        const renewalDate = this.calculateNextPayment(purchaseDateObj, this.subscriptionType);

        console.log('Next Payment Date:', nextPaymentDate);
        console.log('Renewal Date:', renewalDate);

      addDoc(subscriptionsCollection, {
        service_name: this.serviceName,
        amount: this.amount,
        subscription_type: this.subscriptionType,
        purchase_date: this.purchaseDate,
        next_payment_date: nextPaymentDate,
        renewal_date: renewalDate,


      }).then(() => {
        this.serviceName = '';
        this.amount = 0;
        this.subscriptionType = '';
        this.purchaseDate = '';
      }).catch(error => {
        console.error('Error adding subscription: ', error);
      });
    } else {
      console.error('User is not authenticated');
    }
  }

// Updated logic for calculating dates
// Function to calculate next payment and renewal dates
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
// calculateRenewalDate(purchaseDate: Date): Date {
//   // Renewal date logic can be the same as next payment date
//   return this.calculateNextPayment(purchaseDate);
// }

  calculateTotalSpending(subscriptions: Subscription[]): number {
    return subscriptions.reduce((total, sub) => total + sub.amount, 0);
  }
  isEditMode: boolean = false;  // Track whether it's edit or add mode
  currentSubscriptionId: string | null = null;  // Track the subscription being edited


  private subscription$: any; // To store the subscription
  editSubscription(subscriptionId: string) {
    console.log("Edit subscription", subscriptionId);

    this.isEditMode = true; // Set edit mode to true
    this.currentSubscriptionId = subscriptionId; // Store the ID of the subscription to update

    const user = this.auth.currentUser;
    console.log("user--->>>>", user);

    if (user) {
      // Fetch the subscription document by ID
      const subscriptionDoc = doc(this.firestore, `users/${user.uid}/subscriptions/${subscriptionId}`);

       // Unsubscribe from previous subscription if it exists
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }

    this.subscription$ = docData(subscriptionDoc).subscribe((subscription: any) => {
        if (subscription) {
          // Populate the form with the subscription data
          console.log("Subscription data fetched for editing:", subscription);
          this.serviceName = subscription.service_name;
          this.amount = subscription.amount;
          this.subscriptionType = subscription.subscription_type;
          this.purchaseDate = subscription.purchase_date; // Use stored date
        } else {
          console.error("No subscription data found for ID:", subscriptionId);
        }
      });
    } else {
      console.error("User is not authenticated");
    }
  }



  updateSubscription() {
    console.log("updateSubscription!!!!");

    const user = this.auth.currentUser;
    if (user && this.currentSubscriptionId) {
      const subscriptionDoc = doc(this.firestore, `users/${user.uid}/subscriptions/${this.currentSubscriptionId}`);
      console.log("Attempting to update subscription:", this.currentSubscriptionId);

          // Parse the purchase date and calculate new dates
    const purchaseDateObj = new Date(this.purchaseDate);
    const nextPaymentDate = this.calculateNextPayment(purchaseDateObj, this.subscriptionType);
    const renewalDate = this.calculateNextPayment(purchaseDateObj, this.subscriptionType);

    console.log('Updating subscription with:', {
      service_name: this.serviceName,
      amount: this.amount,
      subscription_type: this.subscriptionType,
      purchase_date: this.purchaseDate,
      next_payment_date: nextPaymentDate,
      renewal_date: renewalDate,
    });

      // Update the subscription document
      updateDoc(subscriptionDoc, {
        service_name: this.serviceName,
        amount: this.amount,
        subscription_type: this.subscriptionType,
        purchase_date: this.purchaseDate,
        next_payment_date: nextPaymentDate,
        renewal_date: renewalDate,
    })
        .then(() => {
          console.log("Subscription updated successfully:", this.currentSubscriptionId);
          this.resetForm(); // Reset the form
          this.isEditMode = false; // Exit edit mode
        })
        .catch((error) => {
          console.error("Error updating subscription:", error);
        });
    } else {
      console.error("User not authenticated or currentSubscriptionId is null");
    }
  }


confirmDelete(subscriptionId: string) {
  if (confirm("Are you sure you want to delete this subscription?")) {
    this.deleteSubscription(subscriptionId);
  }
}

deleteSubscription(subscriptionId: string) {
  const user = this.auth.currentUser;
  if (user) {
    const subscriptionDoc = doc(this.firestore, `users/${user.uid}/subscriptions/${subscriptionId}`);
    deleteDoc(subscriptionDoc).then(() => {
      console.log('Subscription deleted');
    }).catch(error => {
      console.error('Error deleting subscription: ', error);
    });
  }
}

addCustomPaymentDate() {
  if (this.customDate) {
    this.customSchedule.push(this.customDate);
    this.customDate = ''; // Clear the input field
  } else {
    console.error('No date selected for custom schedule!');
  }
}


  isRenewalComingUp(renewalDate: string): boolean {
    const today = new Date();
    const renewal = new Date(renewalDate);
    const diffInDays = (renewal.getTime() - today.getTime()) / (1000 * 3600 * 24);
    return diffInDays <= 7;
  }

resetForm() {
  console.log("resetForm called");
 // Reset form state
 this.isEditMode = false;
 this.currentSubscriptionId = null;

 // Reset form fields
 this.serviceName = '';
 this.amount = 0;
 this.subscriptionType = '';
 this.purchaseDate = '';

 // Unsubscribe from active `docData` subscription
 if (this.subscription$) {
   this.subscription$.unsubscribe();
   this.subscription$ = null;
 }

 console.log("Form reset completed", {
   isEditMode: this.isEditMode,
   currentSubscriptionId: this.currentSubscriptionId,
   serviceName: this.serviceName,
   amount: this.amount,
   purchaseDate: this.purchaseDate,
 });
}
}
