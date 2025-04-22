import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true, 
  imports: [RouterOutlet, RouterLink, RouterLinkActive],  // Ajoutez RouterOutlet ici
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

}
