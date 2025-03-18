import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../header/header.component";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  userEmail: string = '';
  userName: string = 'User';
  isEditing: boolean = false;
  // profileImage: string | ArrayBuffer | null = null;
  newPassword: string = '';
  confirmPassword: string = '';
  notifyByEmail: boolean = true;
  notifyBySMS: boolean = false;

  // Additional user fields
  phoneNumber: string = '';
  // country: string = '';
  // currency: string = '';
  // preferredPaymentMethod: string = '';

  // List of supported countries and their default currencies
  // supportedCountries = [
  //   { name: 'USA', currency: 'USD' },
  //   { name: 'India', currency: 'INR' },
  //   { name: 'UK', currency: 'GBP' },
  //   { name: 'Germany', currency: 'EUR' },
  //   { name: 'Japan', currency: 'JPY' },
  //   // Add more countries and currencies as needed
  // ];

  // // List of supported currencies
  // supportedCurrencies = [
  //   { code: 'USD', name: 'US Dollar', symbol: '$' },
  //   { code: 'EUR', name: 'Euro', symbol: '€' },
  //   { code: 'GBP', name: 'British Pound', symbol: '£' },
  //   { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  //   { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  //   // Add more currencies as needed
  // ];


  constructor(private authService: AuthService, private firestore: Firestore, private router: Router, private http: HttpClient) {}

  async ngOnInit() {
    this.authService.currentUser$.subscribe(async (user) => {
      if (user) {
        this.user = user;
        this.userEmail = user.email ?? '';

        // Fetch user details from Firestore
        const userDocRef = doc(this.firestore, `users/${user.uid}`);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          this.userName = userData['name'] ?? user.displayName ?? 'User';
          this.phoneNumber = userData['phoneNumber'] || '';
          this.notifyByEmail = userData['notifyByEmail'] ?? true;
          this.notifyBySMS = userData['notifyBySMS'] ?? false;
          // this.country = userData['country'] || '';
          // this.currency = userData['currency'] || '';
          // this.preferredPaymentMethod = userData['preferredPaymentMethod'] || '';
          // this.profileImage = userData['profileImage'] || 'assets/default-profile.png';
        }
      }
    });
  }

  /** Enable editing mode */
  editProfile() {
    this.isEditing = true;
  }

  /** Save updated profile details */
  async saveProfile() {
    if (this.user) {
      const userDocRef = doc(this.firestore, `users/${this.user.uid}`);

      try {
        await updateDoc(userDocRef, {
          name: this.userName,
          phoneNumber: this.phoneNumber,
          notifyByEmail: this.notifyByEmail,
          notifyBySMS: this.notifyBySMS,
          // country: this.country,
          // currency: this.currency,
          // preferredPaymentMethod: this.preferredPaymentMethod,
          // profileImage: this.profileImage
        });
        this.isEditing = false;
        console.log('Profile updated successfully!');
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  }

   /** Change password */
   async changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await this.http.post('/api/change-password', {
        email: this.userEmail,
        newPassword: this.newPassword
      }).toPromise();
      console.log('Password changed successfully:', response);
      alert('Password changed successfully');
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password');
    }
  }

  /** Handle profile image upload */
  // onFileSelected(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.profileImage = reader.result;
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }

  /** Handle country change */
  // onCountryChange(event: any) {
  //   const selectedCountry = event.target.value;
  //   if (selectedCountry) {
  //     const countryData = this.supportedCountries.find(c => c.name === selectedCountry);
  //     if (countryData) {
  //       this.currency = countryData.currency; // Auto-fill the currency
  //     }
  //   } else {
  //     this.currency = ''; // Reset currency if no country is selected
  //   }
  // }

  /** Logout user */
  logout() {
    this.authService.logOut().then(() => {
      console.log('User logged out');
      this.router.navigate(['/login']);
    }).catch(error => console.error('Error logging out:', error));
  }
}
