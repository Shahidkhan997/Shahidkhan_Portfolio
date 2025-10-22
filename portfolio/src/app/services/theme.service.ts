import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkMode = new BehaviorSubject<boolean>(false);
  public isDarkMode$ = this.isDarkMode.asObservable();

  initTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
      this.setTheme(savedTheme === 'dark');
    } else {
      this.setTheme(prefersDark);
    }
  }

  toggleTheme(): void {
    this.setTheme(!this.isDarkMode.value);
  }

  setTheme(isDark: boolean): void {
    this.isDarkMode.next(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  getCurrentTheme(): boolean {
    return this.isDarkMode.value;
  }
}
