import { Component, OnInit } from '@angular/core';
import { LivreurService } from '../../../services/livreur.service';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-historique-livraisons',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './historique-livraisons.component.html',
  styleUrls: ['./historique-livraisons.component.scss']
})
export class HistoriqueLivraisonsComponent implements OnInit {
  livraisons: any[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private livreurService: LivreurService) {}

  ngOnInit(): void {
    this.loadHistorique();
  }

  loadHistorique(): void {
    this.isLoading = true;
    this.error = null;
    
    this.livreurService.getHistoriqueLivraisons().subscribe({
      next: (livraisons) => {
        this.livraisons = livraisons;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.isLoading = false;
      }
    });
  }
}