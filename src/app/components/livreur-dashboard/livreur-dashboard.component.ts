import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { LivreurService } from '../../services/livreur.service';
import { AuthService } from '../../services/auth.service';
import { LivraisonsEnCoursComponent } from '../livreur/livraisons-en-cours/livraisons-en-cours.component';
import { HistoriqueLivraisonsComponent } from '../livreur/historique-livraisons/historique-livraisons.component';

@Component({
  selector: 'app-livreur-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './livreur-dashboard.component.html',
  styleUrls: ['./livreur-dashboard.component.css']
})
export class LivreurDashboardComponent implements OnInit {
  userNom: string = '';
  currentRoute: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.trackCurrentRoute();
  }

  loadUserData(): void {
    const user = this.authService.getCurrentUser();
    this.userNom = user?.nom || 'Livreur';
  }

  trackCurrentRoute(): void {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  isDefaultView(): boolean {
    return this.currentRoute.endsWith('/livreur-dashboard') || 
           this.currentRoute === '/livreur-dashboard';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}