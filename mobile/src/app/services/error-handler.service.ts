import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';
import { Observable, throwError } from 'rxjs';

/**
 * Global error handler service for the mobile app
 * Intercepts backend errors and shows them in Ionic toasts
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private globalErrorHandlingEnabled = true;
  private toastController: ToastController | null = null;

  constructor() {}

  /**
   * Initialize the toast controller
   * This needs to be called from a component that has access to ToastController
   */
  initialize(toastController: ToastController) {
    this.toastController = toastController;
  }

  /**
   * Enable or disable global error handling
   */
  setGlobalErrorHandling(enabled: boolean) {
    this.globalErrorHandlingEnabled = enabled;
  }

  /**
   * Handle error and show toast notification
   */
  async handleError(error: any, customMessage?: string): Promise<void> {
    if (!this.globalErrorHandlingEnabled || !this.toastController) {
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

    try {
      const toast = await this.toastController.create({
        message: message,
        duration: 5000, // 5 seconds as requested
        color: 'danger',
        position: 'bottom',
        buttons: [
          {
            text: 'Dismiss',
            role: 'cancel'
          }
        ]
      });
      
      await toast.present();
    } catch (toastError) {
      console.error('Failed to show error toast:', toastError);
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