import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-add-livreur',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-livreur.component.html',
  styleUrls: ['./add-livreur.component.css']
})
export class AddLivreurComponent {
  isLoading = false;
  errorMessage: string | null = null;

  livreurForm = new FormGroup({
    nom: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.maxLength(100)
    ]),
    tel: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]{10}$/)
    ]),
    mdp: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(30)
    ])
  });

  constructor(private authService: AuthService) {}

  onSubmit() {
    if (this.livreurForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = null;

    this.authService.registerLivreur(this.livreurForm.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        alert('Livreur ajouté avec succès !');
        this.resetForm();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error.message || 'Une erreur s\'est produite';
        console.error('Erreur:', error);
      }
    });
  }

  resetForm() {
    this.livreurForm.reset();
    this.errorMessage = null;
  }

  showError(controlName: string): boolean {
    const control = this.livreurForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getErrorMessage(controlName: string): string {
    const control = this.livreurForm.get(controlName);
    if (!control || !control.errors) return '';

    if (control.hasError('required')) {
      return 'Ce champ est obligatoire';
    }
    if (control.hasError('email')) {
      return 'Email invalide';
    }
    if (control.hasError('minlength')) {
      return `Minimum ${control.getError('minlength').requiredLength} caractères`;
    }
    if (control.hasError('maxlength')) {
      return `Maximum ${control.getError('maxlength').requiredLength} caractères`;
    }
    if (control.hasError('pattern')) {
      return 'Format invalide (10 chiffres requis)';
    }

    return 'Valeur invalide';
  }
}