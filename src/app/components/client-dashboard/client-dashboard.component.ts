// === client-dashboard.component.ts ===
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { GeminiService } from '../../services/gemini.service';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    FormsModule
  ],
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.css']
})
export class ClientDashboardComponent {
  chatOpen: boolean = false;
  chatMessages: { sender: 'user' | 'assistant', content: string }[] = [];
  userMessage: string = '';
  loading: boolean = false;
  unreadNotificationsCount = 0;
  showNotificationsPanel = false;
  notifications: any[] = [];

  // Questions suggérées
  suggestedQuestions = [
    "Comment suivre ma commande?",
    "Quels sont les délais de livraison?",
    "Comment modifier mon adresse de livraison?",
    "Quels sont les modes de paiement acceptés?",
    "Comment contacter le service client?"
  ];

  // Réponses prédéfinies
  predefinedAnswers: {[key: string]: string} = {
    "Comment suivre ma commande?": "Vous pouvez suivre votre commande dans la section 'Mes Commandes' de votre espace client. Un numéro de suivi vous sera également envoyé par email.",
    "Quels sont les délais de livraison?": "Nos délais de livraison standards sont de 2 à 3 jours ouvrés. Les commandes passées avant 12h sont expédiées le jour même.",
    "Comment modifier mon adresse de livraison?": "Vous pouvez modifier votre adresse de livraison dans 'Mon Profil' avant l'expédition de la commande. Après expédition, contactez notre service client."
  };

  constructor(
    private authService: AuthService,
    private geminiService: GeminiService,
    private notificationService: NotificationService,
    private toastr: ToastrService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.initializeChat();
    this.loadNotifications();
  }



  private initializeChat(): void {
    this.chatMessages.push({
      sender: 'assistant',
      content: 'Bonjour ! Je suis votre assistant virtuel. Voici quelques questions fréquentes :'
    });
  }

  logout() {
    this.authService.logout();
  }

  toggleChat() {
    this.chatOpen = !this.chatOpen;
  }

  // Sélection d'une question suggérée
  selectQuestion(question: string) {
    this.userMessage = question;
    this.sendMessage();
  }

  async sendMessage() {
    const message = this.userMessage.trim();
    if (!message || this.loading) return;

    // Ajouter le message utilisateur
    this.chatMessages.push({ sender: 'user', content: message });
    this.userMessage = '';
    this.loading = true;

    // Vérifier si une réponse prédéfinie existe
    if (this.predefinedAnswers[message]) {
      this.chatMessages.push({
        sender: 'assistant',
        content: this.predefinedAnswers[message]
      });
      this.loading = false;
      return;
    }

    // Sinon, utiliser Gemini
    try {
      const context = `En tant qu'assistant d'une plateforme de livraison, réponds en français à la question suivante de manière concise et professionnelle: ${message}`;
      const response = await this.geminiService.generateText(context);
      
      this.chatMessages.push({
        sender: 'assistant',
        content: response
      });

      // Ajouter la nouvelle question/réponse au dictionnaire
      if (!this.predefinedAnswers[message]) {
        this.predefinedAnswers[message] = response;
      }
    } catch (error) {
      console.error('Erreur:', error);
      this.chatMessages.push({
        sender: 'assistant',
        content: 'Désolé, je rencontre une difficulté technique. Veuillez reformuler votre question.'
      });
    } finally {
      this.loading = false;
    }
  }
  closeChat() {
    this.chatOpen = false;
  }
  loadNotifications() {
    this.notificationService.getMesNotifications().subscribe({
      next: (notifs) => {
        this.notifications = notifs;
        this.unreadNotificationsCount = notifs.filter((n: any) => !n.estVue).length;
      },
      error: (err) => console.error('Erreur notifications:', err)
    });
  }

  toggleNotificationsPanel() {
    this.showNotificationsPanel = !this.showNotificationsPanel;
    if (this.showNotificationsPanel) {
      this.markAllAsRead();
    }
  }

  markAsRead(notificationId: number) {
    this.notificationService.marquerCommeVue(notificationId).subscribe({
      next: () => {
        const notif = this.notifications.find(n => n.id === notificationId);
        if (notif) {
          notif.estVue = true;
          this.unreadNotificationsCount--;
        }
      },
      error: (err) => this.toastr.error('Erreur lors de la mise à jour de la notification')
    });
  }

  markAllAsRead() {
    const unreadIds = this.notifications
      .filter(n => !n.estVue)
      .map(n => n.id);
    
    if (unreadIds.length > 0) {
      this.notificationService.marquerToutesCommeVues(unreadIds).subscribe({
        next: () => {
          this.notifications.forEach(n => n.estVue = true);
          this.unreadNotificationsCount = 0;
        },
        error: (err) => this.toastr.error('Erreur lors de la mise à jour des notifications')
      });
    }
  }
  viewOrder(orderId: number): void {
    // Ferme le panneau de notifications
    this.showNotificationsPanel = false;
    
    // Navigue vers la page de détails de la commande
    this.router.navigate(['/client-dashboard/commandes', orderId]);
    
    // Vous pouvez aussi ajouter un scroll vers la commande spécifique si nécessaire
    // setTimeout(() => {
    //   const element = document.getElementById(`order-${orderId}`);
    //   if (element) {
    //     element.scrollIntoView({ behavior: 'smooth' });
    //   }
    // }, 100);
  }
}