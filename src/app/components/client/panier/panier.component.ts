import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { MatButtonModule } from '@angular/material/button';
import { CommandeService } from '../../../services/commande.service';
import { AuthService } from '../../../services/auth.service'; 
import { Produit } from '../../../models/Produit.interface';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [CommonModule, MatButtonModule], 
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.scss']
})
export class PanierComponent implements OnInit {
  order: Produit[] = [];  // Déclare la propriété order pour le panier
  total: number = 0; // Total de la commande
  clientId: number | null = null; // Déclare clientId ici

  constructor(
    private commandeService: CommandeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Charger le panier depuis localStorage ou toute autre source
    this.loadPanier();

    // Récupérer clientId depuis le service AuthService
    this.clientId = this.authService.getClientId();
    console.log('Client ID:', this.clientId);
  }

  loadPanier() {
    const panier = JSON.parse(localStorage.getItem('panier') || '[]');
    this.order = panier;  // Assigne le panier à la propriété 'order'
    this.updateTotal(); // Recalculer le total du panier
  }

  // Met à jour le total du panier
  updateTotal() {
    this.total = this.order.reduce((sum: number, produit: Produit) => sum + produit.prix, 0);
  }

  // Retirer un produit du panier
  retirerProduit(produit: Produit): void {
    this.order = this.order.filter(p => p.id !== produit.id); // Filtrer le produit à supprimer
    localStorage.setItem('panier', JSON.stringify(this.order)); // Sauvegarder la nouvelle version du panier dans localStorage
    this.updateTotal(); // Recalculer le total après suppression
  }

  passerCommande(): void {
    if (!this.clientId) {
      alert('Client non connecté. Veuillez vous connecter pour passer commande.');
      return;
    }
  
    const produitsIds = this.order
      .filter(p => p.id != null) // Filtrer ceux qui ont un id
      .map(p => p.id);
  
    const commandeDto = {
      clientId: this.clientId,  // ATTENTION : minuscules
      produitsIds: produitsIds
    };
  
    this.commandeService.passerCommande(commandeDto).subscribe(response => {
      alert('Commande passée avec succès!');
      this.order = [];
      localStorage.removeItem('panier'); // Vide aussi localStorage
      console.log('Réponse du backend:', response);
    }, error => {
      alert('Erreur lors de la commande!');
      console.error('Erreur:', error);
    });
  }
}
