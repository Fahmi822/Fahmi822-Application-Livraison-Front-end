import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private apiUrl = 'http://localhost:5287/api/admin/produit';
  private imageBaseUrl = 'http://localhost:5287/images/produits/';

  constructor(private http: HttpClient) { }

  getImageUrl(imageName: string): string {
    return `${this.imageBaseUrl}${imageName}`;
  }

  getAllProduits(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createProduit(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  updateProduit(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

  deleteProduit(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}