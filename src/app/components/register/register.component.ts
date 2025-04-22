import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms'; // Importez FormsModule

@Component({
  selector: 'app-register',
  standalone: true, // Indique que ce composant est standalone
  imports: [FormsModule], // Ajoutez FormsModule ici
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  nom: string = '';
  email: string = '';
  tel: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.register(this.nom, this.email, this.tel, this.password).subscribe({
      next: (response) => {
        console.log('Inscription réussie', response);
        this.router.navigate(['/login']); // Rediriger vers la page de connexion
      },
      error: (err) => {
        console.error('Erreur d\'inscription', err);
        alert('Erreur lors de l\'inscription');
      },
    });
  }
}