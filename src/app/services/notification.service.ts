import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:5287/api/notification';

  constructor(private http: HttpClient,private authService: AuthService) { }
   
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Aucun token disponible');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
  
  getMesNotifications(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/mes-notifications`, {
      headers: this.authService.getHeaders()
    }).pipe(
      catchError(error => {
        if (error.status === 401) {
          this.authService.logout();
        }
        return throwError(() => error);
      })
    );
  }

  marquerCommeVue(notificationId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/marquer-vue/${notificationId}`, {}, {
      headers: this.authService.getHeaders()
    });
  }

  marquerToutesCommeVues(notificationIds: number[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/marquer-toutes-vues`, notificationIds, {
      headers: this.authService.getHeaders()
    });
  }
}