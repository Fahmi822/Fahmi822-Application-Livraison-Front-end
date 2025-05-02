import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';


@Component({
  selector: 'app-list-clients',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './list-clients.component.html',
  styleUrls: ['./list-clients.component.css']
})
export class ListClientsComponent implements OnInit {
  clients: any[] = [];
  filteredClients: any[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  searchText = '';
  currentPage = 1;
  itemsPerPage = 10;
  sortDirection: 'asc' | 'desc' = 'asc';
  sortField = 'nom';
  clientToDelete: number | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.isLoading = true;
    this.adminService.listClients().subscribe({
      next: (response) => {
        this.clients = response;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.errorMessage = "Erreur lors du chargement des clients";
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    this.filteredClients = this.clients.filter(client => 
      client.nom.toLowerCase().includes(this.searchText.toLowerCase()) ||
      client.email.toLowerCase().includes(this.searchText.toLowerCase()) ||
      client.tel.includes(this.searchText)
    );
    this.currentPage = 1;
    this.sortData();
  }

  sort(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.sortData();
  }

  sortData(): void {
    this.filteredClients.sort((a, b) => {
      const valA = a[this.sortField];
      const valB = b[this.sortField];
      
      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  confirmDelete(id: number): void {
   ;
  }

  deleteClient(): void {
    
  }

  exportToExcel(): void {
    // Implémentez l'export Excel ici
    console.log('Export to Excel');
  }

  // Pagination methods
  get totalPages(): number {
    return Math.ceil(this.filteredClients.length / this.itemsPerPage);
  }

  get paginatedClients(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredClients.slice(start, start + this.itemsPerPage);
  }

  getPages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }
}