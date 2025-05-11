import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GeminiService } from '../../services/gemini.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  chatOpen: boolean = false;
  chatMessages: { sender: 'user' | 'assistant', content: string }[] = [];
  userMessage: string = '';
  loading: boolean = false;

  // Questions suggérées
  suggestedQuestions = [
    "Comment créer un compte client?",
    "Comment suivre ma commande?",
    "Quels sont les délais de livraison?",
    "Comment devenir livreur?",
    "Comment contacter le service client?"
  ];

  // Réponses prédéfinies
  predefinedAnswers: {[key: string]: string} = {
    "Comment créer un compte client?": `Pour créer un compte client :
    1. Cliquez sur "Connexion" puis "S'inscrire"
    2. Remplissez le formulaire d'inscription
    3. Validez votre email
    4. Vous pouvez maintenant commander !`,
    
    "Comment suivre ma commande?": `Vous pouvez suivre votre commande :
    - Dans votre espace client > Mes Commandes
    - Via le lien de suivi reçu par email
    - En contactant notre service client`,
    
    "Quels sont les délais de livraison?": `Délais de livraison :
    - Ville : 24h maximum
    - Banlieue : 48h maximum
    - Régions : 3-5 jours ouvrés`,
    
    "Comment devenir livreur?": `Pour devenir livreur Delivro :
    1. Envoyez votre CV à recrutement@delivro.com
    2. Nous vous contacterons pour un entretien
    3. Formation de 2 jours obligatoire
    4. Vous recevrez vos identifiants`,
    
    "Comment contacter le service client?": `Contactez-nous :
    📞 01 23 45 67 89 (24h/24)
    ✉ support@delivro.com
    🏢 10 Rue de la Livraison, Paris`
  };

  constructor(
    private router: Router, 
    private geminiService: GeminiService
  ) {
    this.initializeChat();
  }

  private initializeChat(): void {
    this.chatMessages.push({
      sender: 'assistant',
      content: `🚚 Bienvenue sur Delivro - Votre solution de livraison rapide !
      Comment puis-je vous aider ?`
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  toggleChat() {
    this.chatOpen = !this.chatOpen;
  }

  closeChat() {
    this.chatOpen = false;
  }

  selectQuestion(question: string) {
    this.userMessage = question;
    this.sendMessage();
  }

  async sendMessage() {
    const message = this.userMessage.trim();
    if (!message || this.loading) return;

    // Ajouter le message utilisateur
    this.addUserMessage(message);
    this.userMessage = '';
    this.loading = true;

    // Vérifier les réponses prédéfinies
    const predefinedResponse = this.checkPredefinedResponses(message);
    if (predefinedResponse) {
      this.addAssistantMessage(predefinedResponse);
      this.loading = false;
      return;
    }

    // Utiliser Gemini pour les autres questions
    try {
      const response = await this.getGeminiResponse(message);
      this.addAssistantMessage(response);
      
      // Mémoriser la nouvelle réponse
      if (!this.predefinedAnswers[message]) {
        this.predefinedAnswers[message] = response;
      }
    } catch (error) {
      console.error('Erreur:', error);
      this.addAssistantMessage(`Désolé, je ne peux pas répondre maintenant. 
      Contactez-nous directement : support@delivro.com`);
    } finally {
      this.loading = false;
    }
  }

  private addUserMessage(content: string): void {
    this.chatMessages.push({ 
      sender: 'user', 
      content: content 
    });
  }

  private addAssistantMessage(content: string): void {
    this.chatMessages.push({ 
      sender: 'assistant', 
      content: content 
    });
  }

  private checkPredefinedResponses(message: string): string | null {
    const lowerMessage = message.toLowerCase();
    for (const key in this.predefinedAnswers) {
      if (lowerMessage.includes(key.toLowerCase())) {
        return this.predefinedAnswers[key];
      }
    }
    return null;
  }

  private async getGeminiResponse(prompt: string): Promise<string> {
    const context = `Tu es l'assistant de Delivro, plateforme de livraison. 
    Réponds en français de manière professionnelle et encourageante.
    Pour les demandes techniques, dirige vers support@delivro.com.
    Pour les candidatures livreurs, dirige vers recrutement@delivro.com.
    Question : ${prompt}`;
    
    return await this.geminiService.generateText(context);
  }
}