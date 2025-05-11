import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommandeService } from '../../../services/commande.service';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';
import { NotificationService } from '../../../services/notification.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-commandes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './commandes.component.html',
  styleUrls: ['./commandes.component.scss']
})
export class CommandesComponent implements OnInit {
  commandes: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  selectedCommande: any = null;
  reclamationModal: any;
  reclamationForm: FormGroup;

  constructor(
    private commandeService: CommandeService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.reclamationForm = this.fb.group({
      type: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(20)]]
    });
  }

  ngOnInit(): void {
    this.loadCommandes();
    this.initModal();
  }

  initModal(): void {
    this.reclamationModal = new Modal(document.getElementById('reclamationModal') as any);
  }

  loadCommandes(): void {
    const clientId = this.authService.getClientId();
    
    if (clientId) {
      this.isLoading = true;
      this.commandeService.getCommandesByClient(clientId).subscribe({
        next: (data) => {
          this.commandes = data.map((c: any) => ({ ...c, isOpen: false }));
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors du chargement des commandes';
          this.isLoading = false;
          this.toastr.error(this.errorMessage);
          console.error(err);
        }
      });
    } else {
      this.errorMessage = 'Client non identifié';
      this.isLoading = false;
      this.toastr.error(this.errorMessage);
    }
  }

  toggleCommande(index: number): void {
    this.commandes[index].isOpen = !this.commandes[index].isOpen;
  }

  annulerCommande(commandeId: number): void {
    if (confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      this.commandeService.annulerCommande(commandeId).subscribe({
        next: (response) => {
          const index = this.commandes.findIndex(c => c.id === commandeId);
          if (index !== -1) {
            this.commandes[index].statut = 'Annulée';
          }
          this.toastr.success('Commande annulée. Une notification a été envoyée.', 'Succès');
          this.notificationService.getMesNotifications().subscribe();
        },
        error: (error) => {
          this.errorMessage = 'Échec de l\'annulation';
          this.toastr.error(this.errorMessage);
          console.error(error);
        }
      });
    }
  }

  openReclamationModal(commande: any): void {
    this.selectedCommande = commande;
    this.reclamationForm.reset();
    this.reclamationModal.show();
  }

  submitReclamation(): void {
    if (this.reclamationForm.valid) {
      const reclamationData = {
        commandeId: this.selectedCommande.id,
        clientId: this.authService.getClientId(),
        ...this.reclamationForm.value,
        date: new Date().toISOString()
      };

      this.commandeService.createReclamation(reclamationData).subscribe({
        next: (response) => {
          this.toastr.success('Votre réclamation a été enregistrée avec succès !');
          this.reclamationModal.hide();
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de l\'envoi de la réclamation';
          this.toastr.error(this.errorMessage);
          console.error(error);
        }
      });
    } else {
      this.toastr.warning('Veuillez remplir tous les champs requis', 'Formulaire incomplet');
    }
  }
}