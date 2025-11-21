import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Global error handler service for the web application
 * Shows error notifications using browser's Notification API or simple alerts
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private globalErrorHandlingEnabled = true;

  constructor() {}

  /**
   * Enable or disable global error handling
   */
  setGlobalErrorHandling(enabled: boolean) {
    this.globalErrorHandlingEnabled = enabled;
  }

  /**
   * Handle error and show notification
   */
  async handleError(error: any, customMessage?: string): Promise<void> {
    if (!this.globalErrorHandlingEnabled) {
      return;
    }

    let message = customMessage || 'An error occurred';
    
    // Handle TRPC errors
    if (error && typeof error === 'object') {
      if (error.message) {
        message = error.message;
      } else if (error.error && error.error.message) {
        message = error.error.message;
      }
    }

    // Show error using browser's Notification API if available
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Error', {
        body: message,
        icon: '/favicon.ico'
      });
    } else {
      // Fallback to console error and alert
      console.error('Application Error:', message);
      
      // Only show alert in development mode
      if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        alert(`Error: ${message}`);
      }
    }
  }

  /**
   * Wrap an observable with error handling
   */
  withErrorHandling<T>(observable: Observable<T>, customMessage?: string): Observable<T> {
    return new Observable<T>(subscriber => {
      const subscription = observable.subscribe({
        next: value => subscriber.next(value),
        error: async error => {
          await this.handleError(error, customMessage);
          subscriber.error(error);
        },
        complete: () => subscriber.complete()
      });
      
      return () => subscription.unsubscribe();
    });
  }

  /**
   * Wrap a promise with error handling
   */
  async withErrorHandlingAsync<T>(promise: Promise<T>, customMessage?: string): Promise<T> {
    try {
      return await promise;
    } catch (error) {
      await this.handleError(error, customMessage);
      throw error;
    }
  }
}