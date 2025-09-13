import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout implements OnInit {
  currentUser: User | null = null;
  isProfileSidebarOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Suscribirse al estado de autenticación
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  // Profile sidebar methods
  toggleProfileSidebar() {
    this.isProfileSidebarOpen = !this.isProfileSidebarOpen;
  }

  closeProfileSidebar() {
    this.isProfileSidebarOpen = false;
  }

  openProfileSection() {
    this.closeProfileSidebar();
    this.router.navigate(['/profile']);
  }

  openAddressSection() {
    this.closeProfileSidebar();
    this.router.navigate(['/addresses']);
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  logout() {
    this.authService.logout();
    this.closeProfileSidebar();
    this.router.navigate(['/home']);
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }
}