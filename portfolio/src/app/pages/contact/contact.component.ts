import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [TranslateModule, CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.maxLength(200)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit() {
    // Reset form status when component initializes
    this.contactForm.statusChanges.subscribe(() => {
      this.submitError = null;
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.submitError = null;
      this.submitSuccess = false;

      this.apiService.submitContactForm(this.contactForm.value)
        .pipe(
          finalize(() => {
            this.isSubmitting = false;
          })
        )
        .subscribe({
          next: (response) => {
            this.submitSuccess = true;
            this.contactForm.reset();
            // Hide success message after 5 seconds
            setTimeout(() => {
              this.submitSuccess = false;
            }, 5000);
          },
          error: (error) => {
            console.error('Error submitting form:', error);
            this.submitError = error.error?.message || 'An error occurred while submitting the form. Please try again.';
            // Auto-hide error after 5 seconds
            if (this.submitError) {
              setTimeout(() => {
                this.submitError = null;
              }, 5000);
            }
          }
        });
    } else {
      // Mark all fields as touched to show validation messages
      Object.values(this.contactForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }
}
