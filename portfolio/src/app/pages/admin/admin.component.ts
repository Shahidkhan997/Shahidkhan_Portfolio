import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AdminService, ContactMessage, MessagesResponse, MessageStats } from '../../services/admin.service';
import { CvManagementComponent } from './cv-management/cv-management.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, CvManagementComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  messages: ContactMessage[] = [];
  stats: MessageStats | null = null;
  loading = false;
  error = '';

  // UI State
  activeTab: 'messages' | 'cv' = 'messages';
  
  // Pagination
  currentPage = 1;
  totalPages = 1;
  totalMessages = 0;
  pageSize = 20;

  // Filters
  statusFilter = '';
  searchQuery = '';

  // Authentication
  isAuthenticated = false;
  adminPassword = '';

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.adminService.isAuthenticated();
    if (this.isAuthenticated) {
      this.loadMessages();
      this.loadStats();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  login(): void {
    if (this.adminPassword) {
      this.adminService.setAdminPassword(this.adminPassword);
      this.isAuthenticated = true;
      this.adminPassword = '';
      this.loadMessages();
      this.loadStats();
    }
  }

  logout(): void {
    this.adminService.logout();
    this.isAuthenticated = false;
    this.messages = [];
    this.stats = null;
  }

  // Message management methods
  loadMessages(): void {
    if (!this.isAuthenticated) return;

    this.loading = true;
    this.error = '';

    this.adminService.getAllMessages(
      this.currentPage,
      this.pageSize,
      this.statusFilter || undefined,
      this.searchQuery || undefined
    ).pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response: MessagesResponse) => {
        this.messages = response.data;
        this.currentPage = response.pagination.page;
        this.totalPages = response.pagination.pages;
        this.totalMessages = response.pagination.total;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
        if (error.message.includes('401')) {
          this.isAuthenticated = false;
        }
      }
    });
  }

  loadStats(): void {
    if (!this.isAuthenticated) return;

    this.adminService.getMessageStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.stats = response.data;
        },
        error: (error) => {
          console.error('Error loading stats:', error);
        }
      });
  }

  // Filter methods
  onStatusFilterChange(): void {
    this.currentPage = 1;
    this.loadMessages();
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.loadMessages();
  }

  clearFilters(): void {
    this.statusFilter = '';
    this.searchQuery = '';
    this.currentPage = 1;
    this.loadMessages();
  }

  // Pagination methods
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadMessages();
    }
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  // Message actions
  markAsRead(message: ContactMessage): void {
    if (message.status === 'read') return;

    this.updateMessageStatus(message._id, 'read');
  }

  markAsReplied(message: ContactMessage): void {
    if (message.status === 'replied') return;

    this.updateMessageStatus(message._id, 'replied');
  }

  archiveMessage(message: ContactMessage): void {
    if (message.status === 'archived') return;

    this.updateMessageStatus(message._id, 'archived');
  }

  deleteMessage(message: ContactMessage): void {
    if (confirm(`Are you sure you want to delete the message from ${message.name}?`)) {
      this.adminService.deleteMessage(message._id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadMessages();
            this.loadStats();
          },
          error: (error) => {
            this.error = error.message;
          }
        });
    }
  }

  private updateMessageStatus(messageId: string, status: string): void {
    this.adminService.updateMessageStatus(messageId, status)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadMessages();
          this.loadStats();
        },
        error: (error) => {
          this.error = error.message;
        }
      });
  }

  // Utility methods
  getStatusClass(status: string): string {
    switch (status) {
      case 'new': return 'status-new';
      case 'read': return 'status-read';
      case 'replied': return 'status-replied';
      case 'archived': return 'status-archived';
      default: return '';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  truncateMessage(message: string, length: number = 100): string {
    if (message.length <= length) return message;
    return message.substring(0, length) + '...';
  }

  // Get the end range for pagination display
  get endRange(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalMessages);
  }
}
