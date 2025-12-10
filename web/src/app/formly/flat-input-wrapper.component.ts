import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FieldWrapper, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-flat-input-wrapper',
  template: `
    <div>
      <label
        [attr.for]="id"
        class="block text-lg font-medium text-gray-700 mb-2"
        *ngIf="props.label"
      >
        {{ props.label }}
        <span *ngIf="props.required">*</span>
      </label>
      <ng-template #fieldComponent></ng-template>
      <small *ngIf="props.description" class="form-text">{{
        props.description
      }}</small>
      <div
        *ngIf="showError && formControl.errors"
        class="text-red-500 text-sm mt-1"
      >
        <span *ngFor="let error of getErrorMessages(); let i = index">
          {{ error }}<span *ngIf="i < getErrorMessages().length - 1">, </span>
        </span>
      </div>
    </div>
  `,
  standalone: true,
  // todo: add onPush change detection strategy
  // changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, NgFor],
})
export class FlatInputWrapperComponent extends FieldWrapper<FormlyFieldConfig> {
  override get showError() {
    return !!(
      this.formControl?.errors &&
      // this.formControl?.touched &&
      Object.keys(this.formControl.errors).length > 0
    );
  }

  getErrorMessages(): string[] {
    const errors = [];
    if (this.formControl.errors) {
      for (const key in this.formControl.errors) {
        if (
          Object.prototype.hasOwnProperty.call(this.formControl.errors, key)
        ) {
          const error = this.formControl.errors[key];
          switch (key) {
            case 'required':
              errors.push('This field is required');
              break;
            case 'minlength':
              errors.push(`Minimum length is ${error.requiredLength}`);
              break;
            case 'maxlength':
              errors.push(`Maximum length is ${error.requiredLength}`);
              break;
            case 'email':
              errors.push('Please enter a valid email address');
              break;
            case 'alphanumeric':
              errors.push('This field can only contain letters and numbers');
              break;
            case 'pattern':
              errors.push(
                `This field must match the pattern: ${error.requiredPattern}`
              );
              break;
            case 'range':
              errors.push(
                `Value must be between ${error.min} and ${error.max}`
              );
              break;
            case 'validation_error':
              errors.push(error.message());
              break;
            default:
              errors.push(`${key}: ${JSON.stringify(error)}`);
              break;
          }
        }
      }
    }
    return errors;
  }
}