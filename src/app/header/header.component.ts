import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common'; // ✅ Import CommonModule

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule], // ✅ Ensure CommonModule is included
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  userName: string = '';

  constructor(private authService: AuthService, private router: Router) {
    this.authService.currentUser$.subscribe((user:any) => {
      this.userName = user ? user['name'] : '';
    });
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }
}
