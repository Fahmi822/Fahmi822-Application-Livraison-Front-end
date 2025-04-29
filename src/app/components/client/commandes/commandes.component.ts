// === commandes.component.ts ===
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { CommandeService } from '../../../services/commande.service';
import { AuthService } from '../../../services/auth.service'; // <-- ajoute ceci


@Component({
  selector: 'app-commandes',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatButtonModule],
  templateUrl: './commandes.component.html',
  styleUrls: ['./commandes.component.scss']

})
export class CommandesComponent implements OnInit {
  @Input() clientId: number | null = null;
  commandes: any[] = [];

  constructor(private commandeService: CommandeService,private authService: AuthService) {}

  ngOnInit(): void {
    const clientId = this.authService.getClientId(); // <-- utilise le token JWT
    console.log('Client ID:', clientId); // debug

    if (clientId) {
      this.commandeService.getCommandesByClient(clientId).subscribe((data) => {
        console.log('Commandes reçues:', data); // debug
        this.commandes = data;
      });
    }
  }
  annulerCommande(commandeId: number): void {
    this.commandeService.annulerCommande(commandeId).subscribe({
      next: (response) => {
        console.log('Commande annulée:', response);
        // Après annulation, recharge les commandes ou mets à jour directement l'affichage :
        this.commandes = this.commandes.map(c => 
          c.id === commandeId ? { ...c, statut: 'Annulée' } : c
        );
      },
      error: (error) => {
        console.error('Erreur lors de l\'annulation:', error);
      }
    });
  }
}