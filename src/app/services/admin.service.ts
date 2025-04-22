import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = 'http://localhost:5287/api/admin'; // URL de votre backend

  constructor(private http: HttpClient) {}

  // Lister tous les clients
  listClients(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token non trouvé');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.apiUrl}/list-clients`, { headers });
  }

  // Lister tous les livreurs
  listLivreurs(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token non trouvé');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.apiUrl}/list-livreurs`, { headers });
  }
}