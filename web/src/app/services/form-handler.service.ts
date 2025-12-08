import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { BehaviorSubject } from 'rxjs';

import { ClientValidationErrorType } from '../../server/types/client-error-type';
import { appendServerErrorsAsValidatorsToFields } from '../utils/form-utils';

/**
 * Service to handle common form functionality across the application
 * Provides reusable methods for form field management, validation, and error handling
 */
@Injectable({
  providedIn: 'root',
})
export class FormHandlerService {
  /**
   * Create a BehaviorSubject for form fields
   * @returns BehaviorSubject for form fields
   */
  createFormFieldsSubject(): BehaviorSubject<FormlyFieldConfig[] | null> {
    return new BehaviorSubject<FormlyFieldConfig[] | null>(null);
  }

  /**
   * Process form fields with server-side validation errors
   * @param options Processing options
   * @returns Processed form fields with validation
   */
  processFormFields(options: {
    baseFields: FormlyFieldConfig[];
    clientError?: ClientValidationErrorType;
    mapFields?: (fields: FormlyFieldConfig[]) => FormlyFieldConfig[];
    rootPath?: string;
  }): FormlyFieldConfig[] {
    const { baseFields, clientError, mapFields, rootPath } = options;

    // Add server-side validation errors
    const fieldsWithErrors = appendServerErrorsAsValidatorsToFields({
      clientError,
      formFields: baseFields,
      rootPath,
    });

    // Apply field mapping if provided
    return mapFields ? mapFields(fieldsWithErrors) : fieldsWithErrors;
  }

  /**
   * Update form fields subject with processed fields
   * @param formFields$ Form fields BehaviorSubject
   * @param options Processing options
   */
  updateFormFields(
    formFields$: BehaviorSubject<FormlyFieldConfig[] | null>,
    options: {
      baseFields: FormlyFieldConfig[];
      clientError?: ClientValidationErrorType;
      mapFields?: (fields: FormlyFieldConfig[]) => FormlyFieldConfig[];
      rootPath?: string;
    }
  ): void {
    const processedFields = this.processFormFields(options);
    formFields$.next(processedFields);
  }
}
