import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommandeService } from '../../../services/commande.service';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-commandes',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './admin-commandes.component.html',
  styleUrls: ['./admin-commandes.component.scss']
})
export class AdminCommandesComponent implements OnInit {
  commandes: any[] = [];
  isLoading = false;
  errorMessage = '';
  livreurs: any[] = [];

  constructor(
    private commandeService: CommandeService,
    private notificationService: NotificationService,
    private http: HttpClient,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchCommandes();
    this.fetchLivreurs();
  }

  fetchCommandes(): void {
    this.isLoading = true;
    this.commandeService.getAllCommandes().subscribe({
      next: (data) => {
        this.commandes = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = "Erreur lors du chargement des commandes.";
        this.isLoading = false;
        this.toastr.error(this.errorMessage);
      }
    });
  }

  annulerCommande(commandeId: number): void {
    if (confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      this.commandeService.annulerCommande(commandeId).subscribe({
        next: (response) => {
          // Mettre à jour localement
          const index = this.commandes.findIndex(c => c.id === commandeId);
          if (index !== -1) {
            this.commandes[index].statut = 'Annulée';
          }
          
          // Afficher notification
          this.toastr.success('Commande annulée avec succès', 'Succès');
          
          // Rafraîchir les notifications
          this.notificationService.getMesNotifications().subscribe();
        },
        error: (error) => {
          console.error(error);
          this.toastr.error('Échec de l\'annulation de la commande', 'Erreur');
        }
      });
    }
  }

  fetchLivreurs(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>('http://localhost:5287/api/admin/list-livreurs', { headers })
      .subscribe({
        next: (data) => this.livreurs = data,
        error: (err) => {
          console.error(err);
          this.errorMessage = "Erreur d'autorisation. Veuillez vous reconnecter.";
          this.toastr.error(this.errorMessage);
        }
      });
  }
  
  assignerLivreur(commandeId: number, livreurId: number): void {
    if (!livreurId) {
      this.toastr.warning('Veuillez sélectionner un livreur', 'Attention');
      return;
    }

    const headers = this.authService.getHeaders();

    this.http.put(
      `http://localhost:5287/api/commande/admin/assigner-livreur/${commandeId}?livreurId=${livreurId}`,
      {},
      { headers }
    ).subscribe({
      next: (response: any) => {
        this.toastr.success('Livreur assigné avec succès', 'Succès');
        this.fetchCommandes();
        this.notificationService.getMesNotifications().subscribe();
      },
      error: (err) => {
        console.error('Erreur assignation:', err);
        this.toastr.error('Erreur lors de l\'assignation du livreur', 'Erreur');
      }
    });
  }

  onLivreurChange(event: Event, commandeId: number): void {
    const selectElement = event.target as HTMLSelectElement;
    const livreurId = Number(selectElement.value);
    if (livreurId) {
      this.assignerLivreur(commandeId, livreurId);
    }
  }
}