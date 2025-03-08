import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  logIn() {
    this.authService.logIn(this.email, this.password)
      .then(() => this.router.navigate(['/dashboard']))
      .catch(error => console.error('Login failed', error));
  }

  googleSignIn() {
    this.authService.googleSignIn()
      .then(() => this.router.navigate(['/dashboard']))
      .catch(error => console.error('Google Sign-In failed', error));
  }

  forgotPassword() {
    if (this.email.trim() === '') {
      alert('Please enter your email to reset your password.');
      return;
    }

    this.authService.forgotPassword(this.email)
      .then(() => alert('Password reset link has been sent to your email.'))
      .catch(error => console.error('Error sending password reset email:', error));
  }


  goToSignup() {
    this.router.navigate(['/signup']);
  }
}
