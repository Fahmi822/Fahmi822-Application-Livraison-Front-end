import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importez CommonModule
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-list-livreurs',
  standalone: true, // Indique que ce composant est autonome
  imports: [CommonModule], // Importez CommonModule ici
  templateUrl: './list-livreurs.component.html',
  styleUrls: ['./list-livreurs.component.css'],
})
export class ListLivreursComponent implements OnInit {
  livreurs: any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadLivreurs();
  }

  loadLivreurs(): void {
    this.adminService.listLivreurs().subscribe(
      (response) => {
        this.livreurs = response;
      },
      (error) => {
        console.error('Erreur lors de la récupération des livreurs', error);
      }
    );
  }
}