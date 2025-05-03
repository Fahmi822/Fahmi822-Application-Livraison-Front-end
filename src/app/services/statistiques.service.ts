// services/statistiques.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface RepartitionCategorieDto {
  categorieId: number;
  categorieNom: string;
  nombreProduits: number;
  pourcentage: number;
}

interface CommandesParJourDto {
  date: string;
  nombreCommandes: number;
  revenuTotal: number;
}

@Injectable({
  providedIn: 'root'
})
export class StatistiquesService {
  private apiUrl = 'http://localhost:5287/api/statistiques'; // Remplacez https par http


  constructor(private http: HttpClient) {}

  // Nombre de livreurs
  getNombreLivreurs(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/nombre-livreurs`);
  }

  // Nombre de clients
  getNombreClients(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/nombre-clients`);
  }

  // Nombre total de commandes
  getNombreCommandes(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/nombre-commandes`);
  }

  // Revenu total
  getRevenuTotal(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/revenu-total`);
  }

  // Répartition par catégorie
  getRepartitionCategories(): Observable<RepartitionCategorieDto[]> {
    return this.http.get<RepartitionCategorieDto[]>(`${this.apiUrl}/repartition-categories`);
  }

  // Commandes par jour (avec paramètre optionnel pour le nombre de jours)
  getCommandesParJour(jours: number = 7): Observable<CommandesParJourDto[]> {
    return this.http.get<CommandesParJourDto[]>(`${this.apiUrl}/commandes-par-jour?jours=${jours}`);
  }

  // Livreurs les plus actifs
  getLivreursActifs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/livreurs-actifs`);
  }
}