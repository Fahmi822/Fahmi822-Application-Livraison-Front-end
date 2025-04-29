import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produit } from '../models/Produit.interface';
import { Categorie } from '../models/Categorie.interface';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private adminUrl = 'http://localhost:5287/api/admin/produit';
  private publicUrl = 'http://localhost:5287/api/public/produits';
  private imageBaseUrl = 'http://localhost:5287/images/produits/';

  constructor(private http: HttpClient) {}

  // Pour afficher l'image
  getImageUrl(imageName: string): string {
    return `${this.imageBaseUrl}${imageName}`;
  }

  // ADMIN
  getAllProduits(): Observable<Produit[]> {
    return this.http.get<Produit[]>(this.adminUrl);
  }

  createProduit(formData: FormData): Observable<any> {
    return this.http.post(this.adminUrl, formData);
  }

  updateProduit(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.adminUrl}/${id}`, formData);
  }

  deleteProduit(id: number): Observable<any> {
    return this.http.delete(`${this.adminUrl}/${id}`);
  }

  // PUBLIC
  getProduits(): Observable<Produit[]> {
    return this.http.get<Produit[]>(this.publicUrl);
  }

  getCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(`${this.publicUrl}/categories`);
  }
  

  getProduitsByCategorie(categorieId: number): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.publicUrl}/by-categorie/${categorieId}`);
  }
}
