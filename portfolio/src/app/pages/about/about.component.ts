import { Component, OnDestroy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { CvService } from '../../services/cv.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [TranslateModule, CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  isDownloading = false;
  downloadError: string | null = null;

  constructor(private cvService: CvService) {}

  downloadCv(): void {
    this.isDownloading = true;
    this.downloadError = null;
    
    this.cvService.getCvUrl()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cv) => {
          if (cv && cv.url) {
            // Create a temporary anchor element to trigger the download
            const link = document.createElement('a');
            link.href = cv.url;
            link.download = cv.name || 'CV';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            this.downloadError = 'CV not found. Please try again later.';
          }
          this.isDownloading = false;
        },
        error: (err) => {
          console.error('Error downloading CV:', err);
          this.downloadError = 'Failed to download CV. Please try again later.';
          this.isDownloading = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
