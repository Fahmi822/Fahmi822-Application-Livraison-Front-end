import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5287/api/utilisateur';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  // Obtenir les infos de l'utilisateur connecté
  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Erreur récupération utilisateur', error);
        return throwError(() => error);
      })
    );
  }

  // Modifier le profil de l'utilisateur connecté
  updateCurrentUser(updatedData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/me`, updatedData, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Erreur mise à jour utilisateur', error);
        return throwError(() => error);
      })
    );
  }
}
