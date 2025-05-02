import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategorieService } from '../../../services/categorie.service';

declare var bootstrap: any;

interface Categorie {
  id: number;
  nom: string;
  description: string;
}

interface CategorieFormValue {
  nom: string;
  description: string;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent {
  @ViewChild('addModal') addModal!: ElementRef;
  @ViewChild('editModal') editModal!: ElementRef;

  categories: Categorie[] = [];
  currentCategorie: Categorie | null = null;
  isEditing = false;
  isLoading = false;

  // Formulaire avec typage strict et validation
  categorieForm = new FormGroup({
    nom: new FormControl<string>('', {
      validators: [Validators.required, Validators.minLength(3)],
      nonNullable: true
    }),
    description: new FormControl<string>('', {
      nonNullable: true
    })
  });

  constructor(private categorieService: CategorieService) {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categorieService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur de chargement des catégories:', err);
        this.isLoading = false;
      }
    });
  }

  openAddModal(): void {
    this.resetForm();
    this.isEditing = false;
    const modal = new bootstrap.Modal(this.addModal.nativeElement);
    modal.show();
  }

  openEditModal(categorie: Categorie): void {
    this.currentCategorie = categorie;
    this.isEditing = true;
    this.categorieForm.patchValue({
      nom: categorie.nom,
      description: categorie.description
    });
    const modal = new bootstrap.Modal(this.editModal.nativeElement);
    modal.show();
  }

  submitCategorie(): void {
    if (this.categorieForm.invalid) {
      console.error('Formulaire invalide');
      return;
    }

    // On utilise getRawValue() pour obtenir les valeurs non-nullables
    const formValue = this.categorieForm.getRawValue();

    if (this.isEditing && this.currentCategorie) {
      this.updateCategorie(formValue);
    } else {
      this.createCategorie(formValue);
    }
  }

  private createCategorie(formValue: CategorieFormValue): void {
    this.categorieService.createCategorie(formValue).subscribe({
      next: () => this.handleSuccess('Catégorie créée avec succès'),
      error: (err) => this.handleError('Erreur lors de la création', err)
    });
  }

  private updateCategorie(formValue: CategorieFormValue): void {
    if (!this.currentCategorie) return;

    this.categorieService.updateCategorie(
      this.currentCategorie.id,
      formValue
    ).subscribe({
      next: () => this.handleSuccess('Catégorie mise à jour avec succès'),
      error: (err) => this.handleError('Erreur lors de la mise à jour', err)
    });
  }

  deleteCategorie(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      this.categorieService.deleteCategorie(id).subscribe({
        next: () => {
          this.loadCategories();
          this.showSuccessToast('Catégorie supprimée avec succès');
        },
        error: (err) => this.handleError('Erreur lors de la suppression', err)
      });
    }
  }

  private handleSuccess(message: string): void {
    this.loadCategories();
    this.closeModals();
    this.resetForm();
    this.showSuccessToast(message);
  }

  private handleError(context: string, err: any): void {
    console.error(`${context}:`, err);
    // Ici vous pourriez ajouter un toast d'erreur ou autre notification UI
  }

  private showSuccessToast(message: string): void {
    // Implémentez l'affichage d'un toast de succès si vous en avez
    console.log(message);
  }

  closeModals(): void {
    const modalElements = document.querySelectorAll('.modal');
    modalElements.forEach(el => {
      const modal = bootstrap.Modal.getInstance(el);
      if (modal) modal.hide();
    });
  }

  resetForm(): void {
    this.categorieForm.reset();
    this.currentCategorie = null;
    this.isEditing = false;
  }
}