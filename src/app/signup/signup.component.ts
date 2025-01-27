import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

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

  constructor(private authService: AuthService, private router: Router,private firestore: Firestore) {}

  signUp() {
    this.authService.signUp(this.email, this.password)
      .then((userCredential) => {
        const user = userCredential.user;

        // Store additional user data in Firestore
        const userDocRef = doc(this.firestore, `users/${user.uid}`);
        setDoc(userDocRef, {
          name: this.name,
          email: user.email,
          createdAt: new Date(),
          subscriptions: []
        });

        this.router.navigate(['/dashboard']);
      })
      .catch(error => {
        console.error('Signup failed', error);
      });
  }
}
