import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ProduitService } from '../../../services/produit.service';
import { RouterModule } from '@angular/router';
import { Produit } from '../../../models/Produit.interface';  // <-- AJOUT IMPORTANT

@Component({
  selector: 'app-client-produits',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatCardModule, RouterModule],
  templateUrl: './client-produits.component.html',
  styleUrl: './client-produits.component.scss'
})
export class ClientProduitsComponent implements OnInit {

  @Output() produitAjoute = new EventEmitter<any>();
  produits: Produit[] = [];
  categories: any[] = [];
  selectedCategorieId: number | null = null;
  isLoading: boolean = false;

  constructor(private produitService: ProduitService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProduits();
  }

  loadCategories() {
    this.produitService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  loadProduits() {
    const imageBaseUrl = 'http://localhost:5287/images/produits/';
    const handleData = (data: Produit[]) => {
      this.produits = data.map(p => ({ ...p, imageUrl: `${imageBaseUrl}${p.img}` }));
    };

    if (this.selectedCategorieId) {
      this.produitService.getProduitsByCategorie(this.selectedCategorieId).subscribe(handleData);
    } else {
      this.produitService.getProduits().subscribe(handleData);
    }
  }

  addToOrder(produit: Produit) {
    const panier: Produit[] = JSON.parse(localStorage.getItem('panier') || '[]') as Produit[];

    const produitExistant = panier.find(p => p.id === produit.id);

    if (produitExistant) {
      produitExistant.quantite += 1;
    } else {
      const produitAvecQuantite = { ...produit, quantite: 1 };
      panier.push(produitAvecQuantite);
    }

    localStorage.setItem('panier', JSON.stringify(panier));
    alert(`${produit.nom} a été ajouté au panier.`);
  }

}