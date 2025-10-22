import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translate.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.css']
})
export class LanguageSwitcherComponent {
  dropdownOpen = false;
  currentLanguage = 'en';
  availableLanguages = ['en', 'fr'];

  constructor(private translationService: TranslationService) {
    this.currentLanguage = this.translationService.getCurrentLanguage();
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  setLanguage(lang: string): void {
    this.currentLanguage = lang;
    this.translationService.setLanguage(lang);
    this.closeDropdown();
  }
}
