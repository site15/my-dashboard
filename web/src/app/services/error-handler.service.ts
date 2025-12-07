/* eslint-disable @typescript-eslint/no-explicit-any */
import { injectRequest } from '@analogjs/router/tokens';
import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { from, of, throwError } from 'rxjs';

import {
  ClientErrorType,
  ClientValidationErrorType,
} from '../../server/types/client-error-type';
import { isSSR } from '../../server/utils/is-ssr';

/**
 * Global error handler service for the web application
 * Shows error notifications using browser's Notification API or simple alerts
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  private request = injectRequest();
  private toastrService = inject(ToastrService);

  catchAndProcessServerError(
    err: any,
    setFormlyFields: (options?: {
      clientError?: ClientValidationErrorType;
    }) => void
  ) {
    const clientError = err.data.error.clientError as ClientErrorType;

    if (clientError.event === 'validation_error') {
      setFormlyFields({ clientError });
      return of(null);
    }

    if (clientError.event === 'error') {
      return from(this.handleError(clientError));
    }

    return throwError(() => err);
  }

  /**
   * Handle error and show notification
   */
  async handleError(error: any, customMessage?: string): Promise<void> {
    let message = customMessage || 'An error occurred';

    // Handle TRPC errors
    if (error && typeof error === 'object') {
      if (error.message) {
        message = error.message;
      } else {
        if (error.error && error.error.message) {
          message = error.error.message;
        }
      }
    }
    try {
      if (!isSSR) {
        this.toastrService.error(message, 'Error', {
          timeOut: 3000,
          positionClass: 'toast-bottom-center',
          progressBar: true,
        });
      } else {
        (this.request as any)?.logger?.errorWithStack(message, 'Error');
      }
    } catch (err) {
      console.error(err);
      console.error({ message });
    }
  }
}
