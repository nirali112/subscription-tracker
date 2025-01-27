import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.logIn(this.email, this.password)
      .then(() => {
        this.router.navigate(['/dashboard']);
      })
      .catch(error => {
        console.error('Login failed', error);
      });
  }

  googleSignIn() {
    this.authService.googleSignIn()
      .then(() => {
        this.router.navigate(['/dashboard']);
      })
      .catch(error => {
        console.error('Google Sign-In failed', error);
      });
  }
}
