import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,  // Mark this component as standalone
  imports: [RouterOutlet],  // Import RouterOutlet for routing
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private auth: Auth, private router: Router) {}

  ngOnInit() {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('User is logged in:', user.email);
        this.router.navigate(['/dashboard']);
      } else {
        console.log('No user is logged in. Redirecting to login...');
        this.router.navigate(['/login']);
      }
    });
  }
}
