import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../services/ai.service';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent {
  isOpen = false;
  messages: Message[] = [
    { text: 'Hi! I\'m your AI portfolio assistant. Ask me anything about your profile, experience, projects, or skills!', sender: 'bot', timestamp: new Date() }
  ];
  userInput = '';
  isTyping = false;

  constructor(private aiService: AiService) {}

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  async sendMessage() {
    if (!this.userInput.trim()) return;

    // Add user message
    this.messages.push({ text: this.userInput, sender: 'user', timestamp: new Date() });
    const userMessage = this.userInput;
    this.userInput = '';
    this.isTyping = true;

    try {
      // Get AI response
      const botResponse = await this.aiService.generateResponse(userMessage);

      // Add bot message after a short delay to simulate typing
      setTimeout(() => {
        this.messages.push({ text: botResponse, sender: 'bot', timestamp: new Date() });
        this.isTyping = false;
      }, 800);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setTimeout(() => {
        this.messages.push({
          text: 'Sorry, I\'m having trouble responding right now. Please try again.',
          sender: 'bot',
          timestamp: new Date()
        });
        this.isTyping = false;
      }, 800);
    }
  }
}
