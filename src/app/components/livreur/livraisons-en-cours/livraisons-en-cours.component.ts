import { Component, OnInit } from '@angular/core';
import { LivreurService } from '../../../services/livreur.service';
import { DatePipe } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { CommonModule, NgClass  } from '@angular/common'; // Ajoutez cette ligne
import { ToastrService } from 'ngx-toastr';

interface Produit {
  id: number;
  nom: string;
  prix: number;
  description?: string;
}

interface Commande {
  id: number;
  clientId?: number;
  clientNomComplet: string;
  dateCommande: Date | string;
  montant: number;
  statut: string;
  produits: Produit[];
  livreurId?: number;
  livreurNom?: string;
}

@Component({
  selector: 'app-livraisons-en-cours',
  standalone: true,
  templateUrl: './livraisons-en-cours.component.html',
  imports: [CommonModule, NgClass, DatePipe], // Ajoutez NgClass ici
  styleUrls: ['./livraisons-en-cours.component.scss'],
  providers: [DatePipe]
})
export class LivraisonsEnCoursComponent implements OnInit {
  commandes: Commande[] = [];
  isLoading = true;
  error: string | null = null;
  loadingCommandeIds = new Set<number>();
  currentDate = new Date();

  constructor(
    private livreurService: LivreurService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadCommandes();
  }

  loadCommandes(): void {
    this.isLoading = true;
    this.error = null;

    this.livreurService.getCommandesAssignees()
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (data: any[]) => {
          this.commandes = data.map(item => this.transformCommande(item));
        },
        error: (err) => {
          this.error = this.getErrorMessage(err);
          console.error('Erreur:', err);
        }
      });
  }

  private transformCommande(apiCommande: any): Commande {
    return {
      id: apiCommande.id || apiCommande.Id,
      clientId: apiCommande.clientId || apiCommande.ClientId,
      clientNomComplet: apiCommande.clientNomComplet || apiCommande.ClientNomComplet,
      dateCommande: new Date(apiCommande.dateCommande || apiCommande.DateCommande),
      montant: apiCommande.montant || apiCommande.Montant,
      statut: apiCommande.statut || apiCommande.Statut,
      produits: (apiCommande.produits || apiCommande.Produits || []).map((p: any) => ({
        id: p.id || p.Id,
        nom: p.nom || p.Nom,
        prix: p.prix || p.Prix
      })),
      livreurId: apiCommande.livreurId || apiCommande.LivreurId,
      livreurNom: apiCommande.livreurNom || apiCommande.LivreurNom
    };
  }

  confirmerPriseEnCharge(commandeId: number): void {
  this.loadingCommandeIds.add(commandeId);

  this.livreurService.confirmerCommande(commandeId)
    .pipe(
      finalize(() => this.loadingCommandeIds.delete(commandeId))
    )
    .subscribe({
      next: (response) => {
        console.log('Livraison confirmée:', response);
        this.toastr.success(response.message);
        this.loadCommandes(); // Recharger les données fraîches
      },
      error: (err) => {
        this.error = this.getErrorMessage(err);
        this.toastr.error(this.error);
      }
    });
}

  formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return this.datePipe.transform(dateObj, 'medium') || 'Date inconnue';
  }

  private getErrorMessage(error: any): string {
    if (error.error?.message) return error.error.message;
    if (error.status === 401) return 'Session expirée, veuillez vous reconnecter';
    if (error.status === 404) return 'Ressource non trouvée';
    return 'Une erreur est survenue';
  }

  refresh(): void {
    this.loadCommandes();
  }
}