import { Component, AfterViewInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements AfterViewInit {
  // Statistiques pour les cards
  stats = [
    { title: 'Clients', value: 1245, icon: 'bi-people-fill', color: 'bg-primary' },
    { title: 'Livreurs', value: 42, icon: 'bi-truck', color: 'bg-success' },
    { title: 'Commandes', value: 367, icon: 'bi-receipt', color: 'bg-info' },
    { title: 'Revenus', value: '15,240', icon: 'bi-currency-euro', color: 'bg-warning' }
  ];

  ngAfterViewInit(): void {
    this.initMainChart();
    this.initPieChart();
  }

  private initMainChart(): void {
    Highcharts.chart('main-chart', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Commandes par mois'
      },
      xAxis: {
        categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      yAxis: {
        title: {
          text: 'Nombre de commandes'
        }
      },
      series: [{
        name: '2024',
        type: 'column',
        data: [107, 131, 165, 143, 156, 187, 199, 203, 189, 151, 126, 98],
        color: '#4e73df'
      }],
      credits: {
        enabled: false
      },
      plotOptions: {
        column: {
          borderRadius: 5,
          pointPadding: 0.2,
          borderWidth: 0
        }
      }
    });
  }

  private initPieChart(): void {
    Highcharts.chart('pie-chart', {
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Répartition des catégories'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          }
        }
      },
      series: [{
        type: 'pie', // Ajout du type explicite
        name: 'Commandes',
        colorByPoint: true,
        data: [{
          name: 'Électronique',
          y: 35,
          color: '#4e73df'
        }, {
          name: 'Alimentation',
          y: 25,
          color: '#1cc88a'
        }, {
          name: 'Mode',
          y: 20,
          color: '#36b9cc'
        }, {
          name: 'Maison',
          y: 15,
          color: '#f6c23e'
        }, {
          name: 'Autres',
          y: 5,
          color: '#e74a3b'
        }]
      }],
      credits: {
        enabled: false
      }
    } as any); // Note: le 'as any' peut être supprimé si vous utilisez les bons types
  }
}