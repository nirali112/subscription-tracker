import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  name: string = '';
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  signUp() {
    this.authService.signUp(this.email, this.password, this.name)
      .then(() => this.router.navigate(['/dashboard']))
      .catch(error => console.error('Signup failed', error));
  }

  googleSignUp() {
    this.authService.googleSignIn()
      .then(() => this.router.navigate(['/dashboard']))
      .catch(error => console.error('Google Sign-Up failed', error));
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
