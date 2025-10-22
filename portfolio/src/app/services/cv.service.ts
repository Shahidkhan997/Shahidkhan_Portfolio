import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface CvResponse {
  success: boolean;
  message?: string;
  data?: {
    id: string;
    name: string;
    url: string;
  };
}

export interface CvUrlResponse {
  success: boolean;
  data: {
    url: string;
    name: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CvService {
  private apiUrl = `${environment.apiUrl}/cv`;

  constructor(private http: HttpClient) {}

  // Upload CV file with progress tracking
  uploadCv(file: File): Observable<{ progress?: number; response?: CvResponse }> {
    const formData = new FormData();
    formData.append('cv', file, file.name);

    const req = new HttpRequest('POST', `${this.apiUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req).pipe(
      map(event => this.getEventMessage(event)),
      catchError(this.handleError)
    );
  }

  // Get CV download URL
  getCvUrl(): Observable<{ url: string; name: string }> {
    return this.http.get<CvUrlResponse>(this.apiUrl).pipe(
      map(response => ({
        url: response.data?.url || '',
        name: response.data?.name || 'CV'
      })),
      catchError(this.handleError)
    );
  }

  // Delete CV
  deleteCv(cvId: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${cvId}`).pipe(
      catchError(this.handleError)
    );
  }

  // Helper to process upload progress and response
  private getEventMessage(event: HttpEvent<any>) {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        // Compute and return the progress percentage
        const percentDone = Math.round(100 * event.loaded / (event.total || 1));
        return { progress: percentDone };
      
      case HttpEventType.Response:
        return { response: event.body };
      
      default:
        return {};
    }
  }

  // Error handling
  private handleError(error: any) {
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
