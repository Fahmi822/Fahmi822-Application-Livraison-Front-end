import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../services/admin.service';


@Component({
  selector: 'app-list-livreurs',
  standalone: true,
  imports: [CommonModule, RouterModule,],
  templateUrl: './list-livreurs.component.html',
  styleUrls: ['./list-livreurs.component.css']
})
export class ListLivreursComponent implements OnInit {
  livreurs: any[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadLivreurs();
  }

  loadLivreurs(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.adminService.listLivreurs().subscribe({
      next: (response) => {
        this.livreurs = response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.errorMessage = "Erreur lors du chargement des livreurs";
        this.isLoading = false;
      }
    });
  }

  editLivreur(livreur: any): void {
    // Implémentez la logique d'édition
    console.log('Édition du livreur:', livreur);
  }

  deleteLivreur(id: number): void {
    
  }
}