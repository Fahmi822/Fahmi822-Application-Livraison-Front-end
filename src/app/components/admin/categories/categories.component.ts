import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategorieService } from '../../../services/categorie.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent {
  categories: any[] = [];
  newCategorie = { nom: '', description: '' };
  selectedCategorie: any = null;

  constructor(private categorieService: CategorieService) {
    this.loadCategories();
  }

  loadCategories() {
    this.categorieService.getAllCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error(err)
    });
  }

  addCategorie() {
    this.categorieService.createCategorie(this.newCategorie).subscribe({
      next: () => {
        this.loadCategories();
        this.newCategorie = { nom: '', description: '' };
      },
      error: (err) => console.error(err)
    });
  }

  editCategorie(categorie: any) {
    this.selectedCategorie = { ...categorie };
  }

  updateCategorie() {
    if (this.selectedCategorie) {
      this.categorieService.updateCategorie(this.selectedCategorie.id, this.selectedCategorie)
        .subscribe({
          next: () => {
            this.loadCategories();
            this.selectedCategorie = null;
          },
          error: (err) => console.error(err)
        });
    }
  }

  deleteCategorie(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      this.categorieService.deleteCategorie(id).subscribe({
        next: () => this.loadCategories(),
        error: (err) => console.error(err)
      });
    }
  }
}