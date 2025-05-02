import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/UserService.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userData: any = {
    nom: '',
    email: '',
    tel: '',
    adresse: '',
    vehicule: '',
    imageUrl: '',
    mdp: ''
  };

  isLoading = true;
  showPassword = false;
  message = '';
  imagePreview: string | ArrayBuffer | null = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (data) => {
        this.userData = data;
        this.imagePreview = this.userData.imageUrl;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  updateProfile() {
    this.userService.updateCurrentUser(this.userData).subscribe({
      next: () => {
        this.message = 'Profil mis à jour avec succès.';
      },
      error: () => {
        this.message = 'Erreur lors de la mise à jour.';
      }
    });
  }

  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.userData.imageUrl = reader.result; // Si backend accepte base64
      };
      reader.readAsDataURL(file);
    }
  }
}
