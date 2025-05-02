import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProduitService } from '../../../services/produit.service';
import { CategorieService } from '../../../services/categorie.service';

declare var bootstrap: any; // Déclaration pour Bootstrap JS

@Component({
  selector: 'app-produits',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css']
})
export class ProduitsComponent {
  @ViewChild('addModal') addModal!: ElementRef;
  @ViewChild('editModal') editModal!: ElementRef;

  produits: any[] = [];
  categories: any[] = [];
  selectedFile: File | null = null;
  filePreview: string | ArrayBuffer | null = null;
  currentProduit: any = null;
  isEditing = false;
  isLoading = false;

  produitForm = new FormGroup({
    nom: new FormControl('', [Validators.required, Validators.minLength(3)]),
    prix: new FormControl(0, [Validators.required, Validators.min(0.01)]),
    description: new FormControl(''),
    quantite: new FormControl(0, [Validators.required, Validators.min(0)]),
    categorieId: new FormControl(null, [Validators.required]),
  });

  constructor(
    private produitService: ProduitService,
    private categorieService: CategorieService
  ) {
    this.loadProduits();
    this.loadCategories();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => this.filePreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  loadProduits(): void {
    this.isLoading = true;
    this.produitService.getAllProduits().subscribe({
      next: (data) => {
        this.produits = data.map(p => ({
          ...p,
          imageUrl: `http://localhost:5287/images/produits/${p.img}`
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement produits', err);
        this.isLoading = false;
      }
    });
  }

  loadCategories(): void {
    this.categorieService.getAllCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Erreur chargement catégories', err)
    });
  }

  openAddModal(): void {
    this.resetForm();
    this.isEditing = false;
    const modal = new bootstrap.Modal(this.addModal.nativeElement);
    modal.show();
  }

  openEditModal(produit: any): void {
    this.editProduit(produit);
    this.isEditing = true;
    const modal = new bootstrap.Modal(this.editModal.nativeElement);
    modal.show();
  }

  editProduit(produit: any): void {
    this.currentProduit = produit;
    this.isEditing = true;
    this.produitForm.patchValue({
      nom: produit.nom,
      prix: produit.prix,
      description: produit.description,
      quantite: produit.quantite,
      categorieId: produit.categorieId
    });
    this.filePreview = produit.imageUrl;
  }

  async submitProduit(): Promise<void> {
    if (this.produitForm.invalid) {
      console.error('Formulaire invalide');
      return;
    }
  
    try {
      const formValue = this.produitForm.getRawValue();
      const formData = new FormData();
  
      formData.append('Nom', formValue.nom ?? '');
      formData.append('Prix', (formValue.prix ?? 0).toString());
      formData.append('Description', formValue.description ?? '');
      formData.append('Quantite', (formValue.quantite ?? 0).toString());
      formData.append('CategorieId', (formValue.categorieId ?? 0).toString());
  
      if (this.selectedFile) {
        formData.append('ImgUp', this.selectedFile, this.selectedFile.name);
        formData.append('Img', this.selectedFile.name);
      } else if (this.isEditing && this.currentProduit?.img) {
        formData.append('Img', this.currentProduit.img);
      } else {
        formData.append('Img', '');
      }
  
      const response = this.isEditing
        ? await this.produitService.updateProduit(this.currentProduit.id, formData).toPromise()
        : await this.produitService.createProduit(formData).toPromise();
  
      this.closeModals();
      this.loadProduits();
      this.resetForm();
    } catch (err) {
      this.handleError(err);
    }
  }

  deleteProduit(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.produitService.deleteProduit(id).subscribe({
        next: () => this.loadProduits(),
        error: (err) => console.error('Erreur suppression', err)
      });
    }
  }

  closeModals(): void {
    const modalElements = document.querySelectorAll('.modal');
    modalElements.forEach(el => {
      const modal = bootstrap.Modal.getInstance(el);
      if (modal) modal.hide();
    });
  }

  resetForm(): void {
    this.produitForm.reset({
      nom: '',
      prix: 0,
      description: '',
      quantite: 0,
      categorieId: null
    });
    this.currentProduit = null;
    this.isEditing = false;
    this.selectedFile = null;
    this.filePreview = null;
  }

  private handleError(err: any): void {
    console.error('Erreur:', err);
    if (err.error?.errors) {
      const errorMessages = Object.entries(err.error.errors)
        .map(([key, val]) => `${key}: ${(val as string[]).join(', ')}`);
      alert('Erreurs de validation:\n' + errorMessages.join('\n'));
    } else {
      alert('Erreur: ' + (err.message || 'Une erreur est survenue'));
    }
  }
}