import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';

export interface SnackbarMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    callback: () => void;
  };
}

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private messages$ = new BehaviorSubject<SnackbarMessage[]>([]);
  private messageId = 0;

  get messages(): Observable<SnackbarMessage[]> {
    return this.messages$.asObservable();
  }

  show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration: number = 5000, action?: { label: string; callback: () => void }): string {
    const id = `snackbar-${this.messageId++}`;

    const snackbarMessage: SnackbarMessage = {
      id,
      message,
      type,
      duration,
      action
    };

    // Add message to the list
    const currentMessages = this.messages$.value;
    this.messages$.next([...currentMessages, snackbarMessage]);

    // Auto remove after duration
    if (duration > 0) {
      timer(duration).subscribe(() => {
        this.remove(id);
      });
    }

    return id;
  }

  success(message: string, duration?: number, action?: { label: string; callback: () => void }): string {
    return this.show(message, 'success', duration, action);
  }

  error(message: string, duration?: number, action?: { label: string; callback: () => void }): string {
    return this.show(message, 'error', duration, action);
  }

  warning(message: string, duration?: number, action?: { label: string; callback: () => void }): string {
    return this.show(message, 'warning', duration, action);
  }

  info(message: string, duration?: number, action?: { label: string; callback: () => void }): string {
    return this.show(message, 'info', duration, action);
  }

  remove(id: string): void {
    const currentMessages = this.messages$.value;
    const filteredMessages = currentMessages.filter(msg => msg.id !== id);
    this.messages$.next(filteredMessages);
  }

  clear(): void {
    this.messages$.next([]);
  }

  executeAction(id: string): void {
    const message = this.messages$.value.find(msg => msg.id === id);
    if (message?.action) {
      message.action.callback();
      this.remove(id);
    }
  }
}
