import { Component, OnInit } from '@angular/core';
import { ProduitService } from '../../services/produit.service';
import { CategorieService } from '../../services/categorie.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.css']
})
export class ClientDashboardComponent implements OnInit {
  produits: any[] = [];
  categories: any[] = [];
  filteredProduits: any[] = [];
  selectedCategorieId: number = 0;
  searchTerm: string = '';

  constructor(
    private produitService: ProduitService,
    private categorieService: CategorieService
  ) {}

  ngOnInit(): void {
    this.loadProduits();
    this.loadCategories();
  }

  loadProduits(): void {
    this.produitService.getAllProduits().subscribe({
      next: (data) => {
        this.produits = data;
        this.filteredProduits = [...this.produits];
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  loadCategories(): void {
    this.categorieService.getAllCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Erreur:', err)
    });
  }

  filterProduits(): void {
    this.filteredProduits = this.produits.filter(produit => {
      const matchesCategorie = this.selectedCategorieId === 0 || 
                             produit.categorieId === this.selectedCategorieId;
      const matchesSearch = produit.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           produit.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesCategorie && matchesSearch;
    });
  }

  // AJOUTEZ CETTE MÉTHODE MANQUANTE
  getCategorieName(categorieId: number): string {
    const categorie = this.categories.find(c => c.id === categorieId);
    return categorie ? categorie.nom : 'Non catégorisé';
  }

  addToCart(produit: any): void {
    console.log('Produit ajouté au panier:', produit);
    alert(`${produit.nom} ajouté au panier!`);
  }
}