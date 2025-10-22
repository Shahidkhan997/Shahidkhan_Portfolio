// In cv-management.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CvService, CvResponse } from '../../../services/cv.service';
import { Subject, finalize, takeUntil } from 'rxjs';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cv-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxDropzoneModule],
  templateUrl: './cv-management.component.html',
  styleUrls: ['./cv-management.component.scss']
})
export class CvManagementComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  cvForm = new FormGroup({
    cvFile: new FormControl<File | null>(null, [Validators.required])
  });
  
  currentCv: { url: string; name: string; id?: string } | null = null;
  isLoading = false;
  uploadProgress: number | null = null;
  error: string | null = null;
  success: string | null = null;

  constructor(private cvService: CvService) {}

  ngOnInit(): void {
    this.loadCurrentCv();
  }

  onFileSelected(event: any): void {
    const file = event?.target?.files?.[0];
    if (file) {
      this.cvForm.patchValue({
        cvFile: file
      });
    }
  }

  onDrop(event: any): void {
    const file = event?.addedFiles?.[0];
    if (file) {
      this.cvForm.patchValue({
        cvFile: file
      });
    }
  }

  uploadCv(): void {
    if (this.cvForm.invalid || !this.cvForm.value.cvFile) return;

    this.isLoading = true;
    this.uploadProgress = 0;
    this.error = null;
    this.success = null;

    this.cvService.uploadCv(this.cvForm.value.cvFile)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.uploadProgress = null;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (event) => {
          if (event.progress !== undefined) {
            this.uploadProgress = event.progress;
          }
          if (event.response) {
            this.success = 'CV uploaded successfully!';
            this.loadCurrentCv();
            this.cvForm.reset();
          }
        },
        error: (err) => {
          this.error = err.message || 'Failed to upload CV. Please try again.';
        }
      });
  }

  deleteCv(): void {
    if (!this.currentCv?.id || !confirm('Are you sure you want to delete the current CV?')) return;

    this.isLoading = true;
    this.error = null;
    this.success = null;

    this.cvService.deleteCv(this.currentCv.id)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          this.success = 'CV deleted successfully!';
          this.currentCv = null;
        },
        error: (err) => {
          this.error = err.message || 'Failed to delete CV. Please try again.';
        }
      });
  }

  private loadCurrentCv(): void {
    this.isLoading = true;
    this.cvService.getCvUrl()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cv) => {
          this.currentCv = {
            url: cv.url,
            name: cv.name,
            id: cv.url?.split('/')?.pop()?.split('/')[0] // Extract ID from URL
          };
        },
        error: (err) => {
          this.currentCv = null;
          console.error('Error loading CV:', err);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}