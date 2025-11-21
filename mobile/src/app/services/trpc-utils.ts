import { Observable, firstValueFrom } from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';

/**
 * Utility functions for working with TRPC in the mobile app
 */

/**
 * Execute a TRPC mutation with optional error handling
 * @param mutationFn The TRPC mutation function to execute
 * @param params The parameters for the mutation
 * @param options Options for execution
 * @returns The result of the mutation
 */
export async function executeTrpcMutation<T, P>(
  mutationFn: (params: P) => Promise<T>,
  params: P,
  options?: {
    disableGlobalErrorHandling?: boolean;
    customErrorMessage?: string;
    errorHandler?: ErrorHandlerService;
  }
): Promise<T> {
  // Save the current error handling state
  const originalErrorHandlingState = options?.errorHandler 
    ? true 
    : false;
  
  try {
    // Temporarily disable global error handling if requested
    if (options?.disableGlobalErrorHandling && options?.errorHandler) {
      options.errorHandler.setGlobalErrorHandling(false);
    }
    
    // Execute the mutation
    const result = await mutationFn(params);
    return result;
  } catch (error) {
    // Handle error with custom message if provided and global error handling is enabled
    if (!options?.disableGlobalErrorHandling && options?.errorHandler) {
      await options.errorHandler.handleError(error, options.customErrorMessage);
    }
    throw error;
  } finally {
    // Restore the original error handling state
    if (options?.disableGlobalErrorHandling && options?.errorHandler) {
      options.errorHandler.setGlobalErrorHandling(originalErrorHandlingState);
    }
  }
}

/**
 * Execute a TRPC query with optional error handling
 * @param queryFn The TRPC query function to execute
 * @param options Options for execution
 * @returns The result of the query
 */
export async function executeTrpcQuery<T>(
  queryFn: () => Observable<T>,
  options?: {
    disableGlobalErrorHandling?: boolean;
    customErrorMessage?: string;
    errorHandler?: ErrorHandlerService;
  }
): Promise<T> {
  // Save the current error handling state
  const originalErrorHandlingState = options?.errorHandler 
    ? true 
    : false;
  
  try {
    // Temporarily disable global error handling if requested
    if (options?.disableGlobalErrorHandling && options?.errorHandler) {
      options.errorHandler.setGlobalErrorHandling(false);
    }
    
    // Execute the query
    const result = await firstValueFrom(queryFn());
    return result;
  } catch (error) {
    // Handle error with custom message if provided and global error handling is enabled
    if (!options?.disableGlobalErrorHandling && options?.errorHandler) {
      await options.errorHandler.handleError(error, options.customErrorMessage);
    }
    throw error;
  } finally {
    // Restore the original error handling state
    if (options?.disableGlobalErrorHandling && options?.errorHandler) {
      options.errorHandler.setGlobalErrorHandling(originalErrorHandlingState);
    }
  }
}