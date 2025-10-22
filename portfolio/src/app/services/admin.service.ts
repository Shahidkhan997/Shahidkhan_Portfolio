import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  ipAddress?: string;
  userAgent?: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface MessagesResponse {
  success: boolean;
  data: ContactMessage[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface MessageStats {
  total: number;
  byStatus: {
    new?: number;
    read?: number;
    replied?: number;
    archived?: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl || 'http://localhost:5001/api';

  constructor(private http: HttpClient) {}

  // Get all messages with pagination and filtering
  getAllMessages(page: number = 1, limit: number = 20, status?: string, search?: string): Observable<MessagesResponse> {
    const params: any = { page, limit };
    if (status) params.status = status;
    if (search) params.search = search;

    return this.http.get<MessagesResponse>(`${this.apiUrl}/admin/messages`, {
      params,
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Get message by ID
  getMessageById(id: string): Observable<{ success: boolean; data: ContactMessage }> {
    return this.http.get<{ success: boolean; data: ContactMessage }>(`${this.apiUrl}/admin/messages/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Update message status
  updateMessageStatus(id: string, status: string): Observable<{ success: boolean; data: ContactMessage; message: string }> {
    return this.http.patch<{ success: boolean; data: ContactMessage; message: string }>(
      `${this.apiUrl}/admin/messages/${id}/status`,
      { status },
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Delete message
  deleteMessage(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/admin/messages/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Get message statistics
  getMessageStats(): Observable<{ success: boolean; data: MessageStats }> {
    return this.http.get<{ success: boolean; data: MessageStats }>(`${this.apiUrl}/admin/messages/stats`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Set admin password for authentication
  setAdminPassword(password: string): void {
    localStorage.setItem('adminPassword', password);
  }

  // Get admin password from storage
  getAdminPassword(): string | null {
    return localStorage.getItem('adminPassword');
  }

  // Check if admin is authenticated
  isAuthenticated(): boolean {
    return !!this.getAdminPassword();
  }

  // Clear admin authentication
  logout(): void {
    localStorage.removeItem('adminPassword');
  }

  // Get authentication headers
  private getAuthHeaders() {
    const password = this.getAdminPassword();
    if (password) {
      return new HttpHeaders({ password });
    }
    return new HttpHeaders();
  }

  // Error handling
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error?.message || error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
