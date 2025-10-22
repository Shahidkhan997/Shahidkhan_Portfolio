import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLang = 'en';

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('en');
    this.translate.use('en');

    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      this.setLanguage(savedLang);
    }
  }

  setLanguage(lang: string): void {
    this.currentLang = lang;
    this.translate.use(lang);
    localStorage.setItem('language', lang);

    // Update document direction for RTL languages if needed
    document.documentElement.lang = lang;
  }

  getCurrentLanguage(): string {
    return this.currentLang;
  }

  getAvailableLanguages(): string[] {
    return ['en', 'fr'];
  }

  toggleLanguage(): void {
    const newLang = this.currentLang === 'en' ? 'fr' : 'en';
    this.setLanguage(newLang);
  }
}
