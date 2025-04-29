import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // Pour HttpClient
import { authInterceptor } from './interceptors/auth.interceptor'; // Utiliser la fonction authInterceptor
import { provideAnimations } from '@angular/platform-browser/animations'; // Pour les animations (optionnel)
import { provideToastr } from 'ngx-toastr';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // Pour les notifications (optionnel) 

export const appConfig: ApplicationConfig = {
  providers: [
    // Configuration de Zone.js pour la détection des changements
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Configuration du routeur avec les routes définies dans `app.routes.ts`
    provideRouter(routes),

    // Configuration de HttpClient avec l'interceptor personnalisé
    provideHttpClient(withInterceptors([authInterceptor])), // Utiliser la fonction authInterceptor

    // Configuration des animations (optionnel)
    provideAnimations(),

    // Configuration de ngx-toastr pour les notifications (optionnel)
    provideToastr({
      timeOut: 3000, // Durée d'affichage des notifications
      positionClass: 'toast-bottom-right', // Position des notifications
      preventDuplicates: true, // Empêcher les doublons
    }), provideAnimationsAsync(),
  ],
};