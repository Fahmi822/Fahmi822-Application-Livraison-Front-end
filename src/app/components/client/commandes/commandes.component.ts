import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommandeService } from '../../../services/commande.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-commandes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './commandes.component.html',
  styleUrls: ['./commandes.component.scss']
})
export class CommandesComponent implements OnInit {
  commandes: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private commandeService: CommandeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCommandes();
  }

  loadCommandes(): void {
    const clientId = this.authService.getClientId();
    
    if (clientId) {
      this.isLoading = true;
      this.commandeService.getCommandesByClient(clientId).subscribe({
        next: (data) => {
          this.commandes = data;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors du chargement des commandes';
          this.isLoading = false;
          console.error(err);
        }
      });
    } else {
      this.errorMessage = 'Client non identifié';
      this.isLoading = false;
    }
  }

  annulerCommande(commandeId: number): void {
    if (confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      this.commandeService.annulerCommande(commandeId).subscribe({
        next: (response) => {
          // Mise à jour locale sans rechargement
          const index = this.commandes.findIndex(c => c.id === commandeId);
          if (index !== -1) {
            this.commandes[index].statut = 'Annulée';
          }
        },
        error: (error) => {
          this.errorMessage = 'Échec de l\'annulation';
          console.error(error);
        }
      });
    }
  }
}