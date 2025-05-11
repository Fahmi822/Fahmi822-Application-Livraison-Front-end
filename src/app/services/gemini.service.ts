import { Injectable } from '@angular/core';
import { 
  GoogleGenerativeAI, 
  HarmCategory, 
  HarmBlockThreshold,
  GenerativeModel,
  GenerateContentResult
} from '@google/generative-ai';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private readonly genAI: GoogleGenerativeAI;
  private model!: GenerativeModel; // Definite assignment assertion

  constructor() {
    if (!environment.geminiApiKey) {
      throw new Error('Missing Gemini API key in environment configuration');
    }
    
    this.genAI = new GoogleGenerativeAI(environment.geminiApiKey);
    this.initializeModel();
  }

  private initializeModel(): void {
    try {
      this.model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-pro',
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH
          }
        ]
      });
    } catch (error) {
      throw new Error(`Failed to initialize model: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async generateText(prompt: string): Promise<string> {
    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to generate content. Please try again later.');
    }
  }
}