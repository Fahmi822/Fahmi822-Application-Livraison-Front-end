import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importez CommonModule
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-list-clients',
  standalone: true, // Indique que ce composant est autonome
  imports: [CommonModule], // Importez CommonModule ici
  templateUrl: './list-clients.component.html',
  styleUrls: ['./list-clients.component.css'],
})
export class ListClientsComponent implements OnInit {
  clients: any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.adminService.listClients().subscribe(
      (response) => {
        this.clients = response;
      },
      (error) => {
        console.error('Erreur lors de la récupération des clients', error);
      }
    );
  }
}