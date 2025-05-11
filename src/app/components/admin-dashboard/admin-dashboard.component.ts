import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  unreadNotificationsCount = 0;
  showNotificationsPanel = false;
  notifications: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    public router: Router, // Public pour accès dans le template
    private notificationService: NotificationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.loading = true;
    this.errorMessage = '';

    this.notificationService.getMesNotifications().subscribe({
      next: (notifs) => {
        this.notifications = notifs;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 401) {
          this.errorMessage = 'Session expirée, veuillez vous reconnecter';
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = 'Erreur lors du chargement des notifications';
          console.error('Notification error:', err);
        }
      }
    });
  }

  toggleNotificationsPanel() {
    this.showNotificationsPanel = !this.showNotificationsPanel;
    if (this.showNotificationsPanel) {
      this.markAllAsRead();
    }
  }

  markAsRead(notificationId: number) {
    this.notificationService.marquerCommeVue(notificationId).subscribe({
      next: () => {
        const notif = this.notifications.find(n => n.id === notificationId);
        if (notif) {
          notif.estVue = true;
          this.unreadNotificationsCount--;
        }
      },
      error: (err) => this.toastr.error('Erreur lors de la mise à jour de la notification')
    });
  }

  markAllAsRead() {
    const unreadIds = this.notifications
      .filter(n => !n.estVue)
      .map(n => n.id);
    
    if (unreadIds.length > 0) {
      this.notificationService.marquerToutesCommeVues(unreadIds).subscribe({
        next: () => {
          this.notifications.forEach(n => n.estVue = true);
          this.unreadNotificationsCount = 0;
        },
        error: (err) => this.toastr.error('Erreur lors de la mise à jour des notifications')
      });
    }
  }

  logout() {
    this.authService.logout();
  }

  navigateToDashboard() {
    this.router.navigate(['/admin-dashboard']);
  }
}