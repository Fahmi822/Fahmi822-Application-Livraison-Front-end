import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../../services/client.service'; // (Assure-toi d'avoir un ClientService)
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  profileForm!: FormGroup;
  clientId!: number; // tu récupéreras l'id du client connecté

  constructor(private fb: FormBuilder, private clientService: ClientService) {}

  ngOnInit(): void {
    // Initialisation du formulaire vide
    this.profileForm = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      tel: ['', Validators.required],
      adresse: ['', Validators.required],
      mdp: ['', Validators.required],
    });

    // Charger les infos du client connecté
    this.loadClientInfo();
  }

  loadClientInfo() {
    this.clientService.getClientInfo().subscribe(client => {
      this.clientId = client.id;
      this.profileForm.patchValue({
        nom: client.nom,
        email: client.email,
        tel: client.tel,
        adresse: client.adresse,
        mdp: client.mdp
      });
    });
  }

  updateProfile() {
    if (this.profileForm.valid) {
      this.clientService.updateClientInfo(this.clientId, this.profileForm.value).subscribe(() => {
        alert('Profil mis à jour avec succès.');
      }, error => {
        alert('Erreur lors de la mise à jour du profil.');
      });
    }
  }
}
