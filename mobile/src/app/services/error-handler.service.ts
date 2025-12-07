import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';

/**
 * Global error handler service for the mobile app
 * Intercepts backend errors and shows them in Ionic toasts
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
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
   * Handle error and show toast notification
   */
  async handleError(error: any, customMessage?: string): Promise<void> {
    if (!this.toastController) {
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
            role: 'cancel',
          },
        ],
      });

      await toast.present();
    } catch (toastError) {
      console.error('Failed to show error toast:', toastError);
    }
  }

}
