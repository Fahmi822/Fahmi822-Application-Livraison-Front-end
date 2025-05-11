import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { AuthService } from './auth.service';

interface Commande {
  id: number;
  clientNomComplet: string;
  dateCommande: Date;
  montant: number;
  statut: string;
  produits: Produit[];
}

interface Produit {
  id: number;
  nom: string;
  prix: number;
}

interface Livraison {
  id: number;
  statut: string;
  dateLivraison: Date;
  recu: boolean;
  commande: Commande;
}

@Injectable({
  providedIn: 'root'
})
export class LivreurService {
  private readonly apiUrl = 'http://localhost:5287/api/livreur';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getCommandesAssignees(): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.apiUrl}/commandes-assignees`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      tap(data => console.debug('Commandes assignées:', data)),
      map(commandes => this.mapDates(commandes)),
      catchError(this.handleError)
    );
  }

 confirmerCommande(commandeId: number): Observable<{ 
  message: string, 
  livraisonId: number,
  commande: Commande 
}> {
  return this.http.post<{
    message: string,
    livraisonId: number,
    commande: Commande
  }>(`${this.apiUrl}/confirmer-commande/${commandeId}`, {}).pipe(
    tap(response => {
      console.log('Réponse complète:', response);
      if (!response.commande || response.commande.id === undefined) {
        throw new Error('Réponse invalide du serveur');
      }
    }),
    catchError(this.handleError)
  );
}

  marquerCommeLivree(livraisonId: number): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.apiUrl}/livrer/${livraisonId}`, 
      {}, 
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(response => console.log('Livraison terminée:', response)),
      catchError(this.handleError)
    );
  }

  getHistoriqueLivraisons(): Observable<Livraison[]> {
    return this.http.get<Livraison[]>(`${this.apiUrl}/historique`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      tap(data => console.debug('Historique livraisons:', data)),
      map(livraisons => this.mapLivraisonDates(livraisons)),
      catchError(this.handleError)
    );
  }

  getLivraisonDetails(livraisonId: number): Observable<Livraison> {
    return this.http.get<Livraison>(`${this.apiUrl}/livraison/${livraisonId}`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      tap(data => console.debug('Détails livraison:', data)),
      map(livraison => this.mapSingleLivraisonDates(livraison)),
      catchError(this.handleError)
    );
  }

  private getAuthHeaders(): HttpHeaders {
    const headers = this.authService.getHeaders();
    console.debug('En-têtes de requête:', headers);
    return headers;
  }

  private mapDates(commandes: Commande[]): Commande[] {
    return commandes.map(c => ({
      ...c,
      dateCommande: new Date(c.dateCommande),
      produits: c.produits.map(p => ({ ...p }))
    }));
  }

  private mapLivraisonDates(livraisons: Livraison[]): Livraison[] {
    return livraisons.map(l => ({
      ...l,
      dateLivraison: new Date(l.dateLivraison),
      commande: {
        ...l.commande,
        dateCommande: new Date(l.commande.dateCommande)
      }
    }));
  }

  private mapSingleLivraisonDates(livraison: Livraison): Livraison {
    return {
      ...livraison,
      dateLivraison: new Date(livraison.dateLivraison),
      commande: {
        ...livraison.commande,
        dateCommande: new Date(livraison.commande.dateCommande)
      }
    };
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Erreur API Livreur:', error);

    let errorMessage = 'Une erreur est survenue';
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      if (error.status === 0) {
        errorMessage = 'Impossible de se connecter au serveur';
      } else if (error.status === 401) {
        errorMessage = 'Session expirée, veuillez vous reconnecter';
        // Optionnel: déconnexion automatique
        this.authService.logout();
      } else if (error.status === 404) {
        errorMessage = 'Ressource non trouvée';
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}