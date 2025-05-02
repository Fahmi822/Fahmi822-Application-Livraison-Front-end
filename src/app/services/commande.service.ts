import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private apiUrl = 'http://localhost:5287/api/commande'; // URL de ton API pour la commande

  constructor(private http: HttpClient) {}

  passerCommande(commandeDto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/passer`, commandeDto);
  }

  getCommandesByClient(clientId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/client/${clientId}`);
  }
  annulerCommande(commandeId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/annuler/${commandeId}`, {});
  }
  getAllCommandes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}

