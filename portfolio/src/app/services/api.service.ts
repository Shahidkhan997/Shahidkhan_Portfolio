import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl || 'http://localhost:5001/api';

  constructor(private http: HttpClient) {}

  // Contact Form Submission
  submitContactForm(formData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/contact`, formData).pipe(
      catchError(this.handleError)
    );
  }

  // Track Page View
  trackPageView(page: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/analytics/pageview`, { page }).pipe(
      catchError(this.handleError)
    );
  }

  // Get Analytics Summary (protected)
  getAnalyticsSummary(): Observable<any> {
    return this.http.get(`${this.apiUrl}/analytics/summary`).pipe(
      catchError(this.handleError)
    );
  }

  // Get View Trends (protected)
  getViewTrends(days: number = 30): Observable<any> {
    return this.http.get(`${this.apiUrl}/analytics/trends?days=${days}`).pipe(
      catchError(this.handleError)
    );
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
