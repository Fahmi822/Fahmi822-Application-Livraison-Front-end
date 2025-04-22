import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms'; // Importez FormsModule

@Component({
  selector: 'app-login',
  standalone: true, // Indique que ce composant est standalone
  imports: [FormsModule], // Ajoutez FormsModule ici
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Connexion réussie', response);
        // La redirection est gérée dans AuthService
      },
      error: (err) => {
        console.error('Erreur de connexion', err);
        alert('Email ou mot de passe incorrect. Veuillez réessayer.');
      },
    });
  }
}