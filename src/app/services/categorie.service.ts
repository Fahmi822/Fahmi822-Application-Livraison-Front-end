import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {
  private apiUrl = 'http://localhost:5287/api/admin/categorie'; 

  constructor(private http: HttpClient) { }

  // Récupérer toutes les catégories
  getAllCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Créer une nouvelle catégorie
  createCategorie(categorieData: { nom: string, description: string }): Observable<any> {
    return this.http.post(this.apiUrl, categorieData);
  }

  // Mettre à jour une catégorie existante
  updateCategorie(id: number, categorieData: { nom: string, description: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, categorieData);
  }

  // Supprimer une catégorie
  deleteCategorie(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Récupérer une catégorie spécifique
  getCategorieById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}