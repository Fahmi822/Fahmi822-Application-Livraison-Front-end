import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable,throwError} from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5287/api/auth'; // URL de votre backend
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) {}
  isTokenExpired(): boolean {
    const token = this.getToken();
    return !token || this.jwtHelper.isTokenExpired(token);
  }
  // Connexion
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { 
      email, 
      mdp: password // Corrigé pour correspondre au backend
    }).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        // Stockez les informations utilisateur de manière structurée
        localStorage.setItem('user', JSON.stringify({
          nom: response.nom,
          role: response.role,
          clientId: response.clientId // Utilisez le même nom que le backend
        }));
        this.redirectBasedOnRole(response.role);
      })
      );
  }
  
  
  registerLivreur(livreurData: any): Observable<any> {
    // Récupérer le token JWT depuis le localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('Token non trouvé'));
    }
  
    // Ajouter le token dans l'en-tête de la requête
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  
    // Envoyer la requête POST
    return this.http.post(`${this.apiUrl}/admin/register-livreur`, livreurData, { headers }).pipe(
      tap((response) => {
        console.log('Livreur ajouté avec succès', response);
      }),
      catchError((error) => {
        console.error('Erreur lors de l\'ajout du livreur', error);
        return throwError(() => error);
      })
    );
  }


  // Rediriger en fonction du rôle
  private redirectBasedOnRole(role: string): void {
    switch (role) {
      case 'Admin':
        this.router.navigate(['/admin-dashboard']);
        break;
      case 'Client':
        this.router.navigate(['/client-dashboard']);
        break;
      case 'Livreur':
        this.router.navigate(['/livreur-dashboard']);
        break;
      default:
        this.router.navigate(['/']); // Rediriger vers la page d'accueil par défaut
    }
  }

  // Inscription (Client)
  register(nom: string, email: string, tel: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, {
      nom,
      email,
      tel,
      mdp: password,
    });
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token); // Vérifie si le token est valide
  }

  // Récupérer le rôle de l'utilisateur
  getUserRole(): string {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role;
  }

  // Déconnexion
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  // Récupérer le token
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  
  getHeaders() {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  getClientId(): number | null {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      // Vérification plus stricte du claim
      return decodedToken['ClientId'] || null;
    } catch (error) {
      console.error('Erreur de décodage du token', error);
      return null;
    }
  }
getCurrentUser(): any {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}



}