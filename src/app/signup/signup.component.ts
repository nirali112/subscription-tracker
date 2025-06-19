import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async signUp() {
    if (!this.name || !this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      await this.authService.signUp(this.email, this.password, this.name);
      this.successMessage = 'Account created successfully! Redirecting...';

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1500);

    } catch (error: any) {
      this.isLoading = false;

      // Handle specific Firebase errors
      switch (error.code) {
        case 'auth/email-already-in-use':
          this.errorMessage = 'This email is already registered. Please use a different email.';
          break;
        case 'auth/weak-password':
          this.errorMessage = 'Password is too weak. Please choose a stronger password.';
          break;
        case 'auth/invalid-email':
          this.errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/operation-not-allowed':
          this.errorMessage = 'Email/password accounts are not enabled. Please contact support.';
          break;
        default:
          this.errorMessage = 'Failed to create account. Please try again.';
          console.error('Signup error:', error);
      }
    }
  }

  async googleSignIn() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      await this.authService.googleSignIn();
      this.successMessage = 'Account created successfully! Redirecting...';

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1500);

    } catch (error: any) {
      this.isLoading = false;

      switch (error.code) {
        case 'auth/popup-closed-by-user':
          this.errorMessage = 'Sign-in was cancelled. Please try again.';
          break;
        case 'auth/popup-blocked':
          this.errorMessage = 'Pop-up was blocked. Please allow pop-ups and try again.';
          break;
        default:
          this.errorMessage = 'Failed to sign in with Google. Please try again.';
          console.error('Google sign-in error:', error);
      }
    }
  }
}
