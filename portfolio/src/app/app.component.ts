import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ChatbotComponent],
  template: `
    <div class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <app-navbar></app-navbar>
      <main class="flex-1">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
      <app-chatbot></app-chatbot>
    </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'portfolio';

  constructor(private themeService: ThemeService) {
    this.themeService.initTheme();
  }
}
