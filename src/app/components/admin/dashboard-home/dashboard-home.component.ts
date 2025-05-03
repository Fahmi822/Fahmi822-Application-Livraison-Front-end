import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { StatistiquesService } from '../../../services/statistiques.service';
import * as Highcharts from 'highcharts';
import { finalize } from 'rxjs/operators';

interface ChartData {
  date: string;
  nombreCommandes: number;
}

interface CategorieData {
  categorieNom: string;
  nombreProduits: number;
}

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit, AfterViewInit {
  stats = [
    { title: 'Clients', value: 0, icon: 'bi-people-fill', color: 'primary' },
    { title: 'Livreurs', value: 0, icon: 'bi-truck', color: 'success' },
    { title: 'Commandes', value: 0, icon: 'bi-receipt', color: 'info' },
    { title: 'Revenus', value: '0 €', icon: 'bi-currency-euro', color: 'warning' }
  ];

  isLoading = true;
  chartInitialized = false;

  constructor(private statsService: StatistiquesService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  ngAfterViewInit(): void {
    this.chartInitialized = true;
  }

  loadStats(): void {
    this.isLoading = true;
    
    this.statsService.getNombreClients().pipe(
      finalize(() => this.checkLoading())
    ).subscribe({
      next: count => this.stats[0].value = count,
      error: err => console.error('Erreur clients:', err)
    });

    this.statsService.getNombreLivreurs().pipe(
      finalize(() => this.checkLoading())
    ).subscribe({
      next: count => this.stats[1].value = count,
      error: err => console.error('Erreur livreurs:', err)
    });

    this.statsService.getNombreCommandes().pipe(
      finalize(() => this.checkLoading())
    ).subscribe({
      next: count => this.stats[2].value = count,
      error: err => console.error('Erreur commandes:', err)
    });

    this.statsService.getRevenuTotal().pipe(
      finalize(() => this.checkLoading())
    ).subscribe({
      next: revenu => this.stats[3].value = `${revenu} €`,
      error: err => console.error('Erreur revenu:', err)
    });

    this.loadChartData();
  }

  private loadChartData(): void {
    this.statsService.getRepartitionCategories().subscribe({
      next: data => this.initPieChart(data),
      error: err => console.error('Erreur catégories:', err)
    });

    this.statsService.getCommandesParJour().subscribe({
      next: data => this.initMainChart(data),
      error: err => console.error('Erreur commandes par jour:', err)
    });
  }

  private checkLoading(): void {
    if (this.stats.every(stat => stat.value !== 0)) {
      this.isLoading = false;
    }
  }

  private initMainChart(data: ChartData[]): void {
    if (!this.chartInitialized || !document.getElementById('main-chart')) return;

    Highcharts.chart('main-chart', {
      chart: { 
        type: 'line',
        backgroundColor: 'transparent'
      },
      title: { 
        text: 'Commandes par jour',
        style: { color: '#333' }
      },
      xAxis: { 
        categories: data.map(item => item.date),
        title: { text: 'Date' },
        labels: { style: { color: '#666' } }
      },
      yAxis: { 
        title: { 
          text: 'Nombre de commandes',
          style: { color: '#666' } 
        },
        min: 0,
        gridLineColor: 'rgba(0,0,0,0.1)'
      },
      series: [{
        type: 'line',
        name: 'Commandes',
        data: data.map(item => item.nombreCommandes),
        color: '#4e73df',
        marker: {
          radius: 4,
          fillColor: '#FFFFFF',
          lineWidth: 2,
          lineColor: '#4e73df'
        }
      }],
      legend: {
        itemStyle: { color: '#333' }
      },
      credits: { enabled: false }
    });
  }

  private initPieChart(data: CategorieData[]): void {
    if (!this.chartInitialized || !document.getElementById('pie-chart')) return;

    Highcharts.chart('pie-chart', {
      chart: { 
        type: 'pie',
        backgroundColor: 'transparent'
      },
      title: { 
        text: 'Répartition par catégorie',
        style: { color: '#333' }
      },
      series: [{
        type: 'pie',
        name: 'Commandes',
        data: data.map(item => ({
          name: item.categorieNom,
          y: item.nombreProduits,
          color: this.getRandomColor()
        })),
        size: '80%',
        innerSize: '40%',
        showInLegend: true,
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.y}',
          style: {
            textOutline: 'none',
            color: '#333'
          }
        }
      }],
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          borderWidth: 0,
          shadow: false,
          center: ['50%', '50%']
        }
      },
      credits: { enabled: false }
    });
  }

  private getRandomColor(): string {
    const colors = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}