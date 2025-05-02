import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommandeService } from '../../../services/commande.service';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
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
 

    


  constructor(private commandeService: CommandeService, private http: HttpClient,private authService: AuthService) {}

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
      }
    });
  }

  annulerCommande(id: number): void {
    if (confirm('Voulez-vous vraiment annuler cette commande ?')) {
      this.commandeService.annulerCommande(id).subscribe({
        next: () => this.fetchCommandes(),
        error: () => alert("Erreur lors de l'annulation de la commande.")
      });
    }
  }

  fetchLivreurs(): void {
    const token = localStorage.getItem('token'); // Récupère le token du localStorage
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    this.http.get<any[]>('http://localhost:5287/api/admin/list-livreurs', { headers })
      .subscribe({
        next: (data) => this.livreurs = data,
        error: (err) => {
          console.error(err);
          this.errorMessage = "Erreur d'autorisation. Veuillez vous reconnecter.";
        }
      });
  }
  
  assignerLivreur(commandeId: number, livreurId: number): void {
    if (!livreurId) return;
  
    const headers = this.authService.getHeaders(); // Si tu utilises un token JWT
  
    this.http.put(
      `http://localhost:5287/api/commande/admin/assigner-livreur/${commandeId}?livreurId=${livreurId}`,
      {},
      { headers } // Inclure les headers ici si nécessaire
    ).subscribe({
      next: () => {
        alert('Commande assignée avec succès');
        this.fetchCommandes();
      },
      error: () => alert('Erreur lors de l\'assignation')
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