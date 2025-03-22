import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,  // Mark this component as standalone
  imports: [CommonModule,RouterOutlet],  // Import RouterOutlet for routing
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isAuthResolved = false;
  constructor(private auth: Auth, private router: Router) {}

  ngOnInit() {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        // console.log('User is logged in:', user.email);
        this.router.navigate(['/dashboard']);
      } else {
        // console.log('No user is logged in. Redirecting to login...');
        this.router.navigate(['/login']);
      }
      this.isAuthResolved = true; // Firebase has finished checking auth
    });
  }
}
