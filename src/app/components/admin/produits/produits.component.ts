import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProduitService } from '../../../services/produit.service';
import { CategorieService } from '../../../services/categorie.service';

@Component({
  selector: 'app-produits',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css']
})
export class ProduitsComponent {
  produits: any[] = [];
  categories: any[] = [];
  selectedFile: File | null = null;
  filePreview: string | ArrayBuffer | null = null;
  currentProduit: any = null;
  isEditing = false;

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
    this.produitService.getAllProduits().subscribe({
      next: (data) => {
        // Ajoutez ici la ligne pour générer l'URL de l'image pour chaque produit
        this.produits = data.map(p => ({
          ...p,
          imageUrl: `http://localhost:5287/images/produits/${p.img}`  // Vérifiez que p.img contient bien le nom de l'image
        }));
      },
      error: (err) => console.error('Erreur chargement produits', err)
    });
  }
  

  loadCategories(): void {
    this.categorieService.getAllCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Erreur chargement catégories', err)
    });
  }

  async submitProduit(): Promise<void> {
    if (this.produitForm.invalid) {
      console.error('Formulaire invalide');
      return;
    }
  
    try {
      const formValue = this.produitForm.getRawValue();
      const formData = new FormData();
  
      // Ajout des autres champs
      formData.append('Nom', formValue.nom ?? '');
      formData.append('Prix', (formValue.prix ?? 0).toString());
      formData.append('Description', formValue.description ?? '');
      formData.append('Quantite', (formValue.quantite ?? 0).toString());
      formData.append('CategorieId', (formValue.categorieId ?? 0).toString());
  
      // Ajouter l'image sélectionnée ou l'image existante si l'on modifie un produit
      if (this.selectedFile) {
        formData.append('ImgUp', this.selectedFile, this.selectedFile.name);  // Envoi du fichier image
        formData.append('Img', this.selectedFile.name);  // Envoyer le nom de l'image
      } else if (this.isEditing && this.currentProduit?.img) {
        // Si l'on édite, on envoie l'image existante
        formData.append('Img', this.currentProduit.img);  // Envoi du nom de l'image existante
      } else {
        formData.append('Img', '');  // Pas d'image
      }
  
      // Débogage des données FormData envoyées
      this.debugFormData(formData);
  
      const response = this.isEditing
        ? await this.produitService.updateProduit(this.currentProduit.id, formData).toPromise()
        : await this.produitService.createProduit(formData).toPromise();
  
      this.resetForm();
      this.loadProduits();
    } catch (err) {
      this.handleError(err);
    }
  }
  

  private debugFormData(formData: FormData): void {
    const formDataObj: any = {};
    formData.forEach((value, key) => {
      formDataObj[key] = value instanceof File ? value.name : value;
    });
    console.log('FormData envoyé:', formDataObj);
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
    this.filePreview = this.produitService.getImageUrl(produit.img);
  }

  deleteProduit(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.produitService.deleteProduit(id).subscribe({
        next: () => this.loadProduits(),
        error: (err) => console.error('Erreur suppression', err)
      });
    }
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
}

