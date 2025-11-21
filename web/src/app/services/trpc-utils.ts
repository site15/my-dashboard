import { Observable, from, defer, isObservable } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { ErrorHandlerService } from './error-handler.service';

/**
 * Utility functions for working with TRPC in the web application
 */

/**
 * Execute a TRPC mutation with optional error handling
 * @param mutationFn The TRPC mutation function to execute
 * @param params The parameters for the mutation
 * @param options Options for execution
 * @returns Observable of the result of the mutation
 */
export function executeTrpcMutation<T, P>(
  mutationFn: (params: P) => Promise<T> | Observable<T>,
  params: P,
  options?: {
    disableGlobalErrorHandling?: boolean;
    customErrorMessage?: string;
    errorHandler?: ErrorHandlerService;
  }
): Observable<T> {
  return defer(() => {
    // Save the current error handling state
    const originalErrorHandlingState = options?.errorHandler 
      ? true 
      : false;
    
    // Temporarily disable global error handling if requested
    if (options?.disableGlobalErrorHandling && options?.errorHandler) {
      options.errorHandler.setGlobalErrorHandling(false);
    }
    
    // Execute the mutation - handle both Promise and Observable
    const result = mutationFn(params);
    const observableResult = isObservable(result) ? result : from(result);
    
    return observableResult.pipe(
      catchError(error => {
        // Handle error with custom message if provided and global error handling is enabled
        if (!options?.disableGlobalErrorHandling && options?.errorHandler) {
          // We need to handle the error asynchronously but return EMPTY to prevent breaking the stream
          options.errorHandler.handleError(error, options.customErrorMessage).catch(console.error);
        }
        throw error;
      }),
      finalize(() => {
        // Restore the original error handling state
        if (options?.disableGlobalErrorHandling && options?.errorHandler) {
          options.errorHandler.setGlobalErrorHandling(originalErrorHandlingState);
        }
      })
    );
  });
}

/**
 * Execute a TRPC query with optional error handling
 * @param queryFn The TRPC query function to execute
 * @param options Options for execution
 * @returns Observable of the result of the query
 */
export function executeTrpcQuery<T>(
  queryFn: () => Observable<T>,
  options?: {
    disableGlobalErrorHandling?: boolean;
    customErrorMessage?: string;
    errorHandler?: ErrorHandlerService;
  }
): Observable<T> {
  return defer(() => {
    // Save the current error handling state
    const originalErrorHandlingState = options?.errorHandler 
      ? true 
      : false;
    
    // Temporarily disable global error handling if requested
    if (options?.disableGlobalErrorHandling && options?.errorHandler) {
      options.errorHandler.setGlobalErrorHandling(false);
    }
    
    // Execute the query
    return queryFn().pipe(
      catchError(error => {
        // Handle error with custom message if provided and global error handling is enabled
        if (!options?.disableGlobalErrorHandling && options?.errorHandler) {
          // We need to handle the error asynchronously but return EMPTY to prevent breaking the stream
          options.errorHandler.handleError(error, options.customErrorMessage).catch(console.error);
        }
        throw error;
      }),
      finalize(() => {
        // Restore the original error handling state
        if (options?.disableGlobalErrorHandling && options?.errorHandler) {
          options.errorHandler.setGlobalErrorHandling(originalErrorHandlingState);
        }
      })
    );
  });
}