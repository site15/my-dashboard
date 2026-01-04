import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { BehaviorSubject } from 'rxjs';

interface ColorOption {
  value: string;
  label: string;
}

@Component({
  selector: 'formly-color-select-type',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Custom select with color circles -->
    <div
      class="custom-select flat-input"
      [id]="'color-select-' + componentId"
      [class.open]="isOpen$ | async"
      (click)="toggleSelect()"
    >
      <div class="selected-option">
        <ng-container *ngIf="selectedValue; else placeholderTemplate">
          <span
            class="color-circle"
            [style.background-color]="getColorValue(selectedValue)"
          ></span>
          <span>{{ getSelectedLabel() }}</span>
        </ng-container>
        <ng-template #placeholderTemplate>
          <span>{{ props.placeholder || 'Select a color' }}</span>
        </ng-template>
        <i data-lucide="chevron-down" class="w-5 h-5 ml-auto"></i>
      </div>

      <div class="options-dropdown" *ngIf="isOpen$ | async">
        <div
          class="option-item flex items-center"
          *ngFor="let option of getOptions()"
          (click)="selectOption(option)"
          [class.selected]="option.value === selectedValue"
        >
          <span
            class="color-circle"
            [style.background-color]="getColorValue(option.value)"
          ></span>
          <span>{{ option.label }}</span>
        </div>
      </div>
    </div>

    <!-- Hidden native select for form control -->
    <select [id]="id" [formControl]="formControl" class="hidden">
      <option value="" *ngIf="props.placeholder">
        {{ props.placeholder }}
      </option>
      <ng-container *ngFor="let option of getOptions()">
        <option [value]="option.value">{{ option.label }}</option>
      </ng-container>
    </select>

    <small *ngIf="props.description" class="form-text">{{
      props.description
    }}</small>
  `,
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule, AsyncPipe],
})
export class ColorSelectTypeComponent
  extends FieldType<FieldTypeConfig>
  implements OnInit
{
  isOpen$ = new BehaviorSubject<boolean>(false);
  selectedValue: string | null = null;

  // Unique ID for this component instance
  componentId = Math.random().toString(36).substring(2, 15);

  // Store reference to the close listener so we can remove it properly
  private closeSelectListener: ((event: MouseEvent) => void) | null = null;

  ngOnInit() {
    // Set initial value if it exists in the form control
    if (this.formControl.value) {
      this.selectedValue = this.formControl.value;
    }
  }

  getColorValue(colorName: string): string {
    // Map color names to actual color values
    const colorMap: Record<string, string> = {
      blue: '#3b82f6',
      orange: '#f97316',
      purple: '#8b5cf6',
      green: '#10b981',
      red: '#ef4444',
      yellow: '#eab308',
      pink: '#ec4899',
      default: '#6b7280',
    };

    return colorMap[colorName.toLowerCase()] || colorMap['default'];
  }

  getOptions(): ColorOption[] {
    return Array.isArray(this.props.options) ? this.props.options : [];
  }

  getSelectedLabel(): string {
    const options = this.getOptions();
    const selectedOption = options.find(
      option => option.value === this.selectedValue
    );
    return selectedOption ? selectedOption.label : '';
  }

  toggleSelect() {
    const newState = !this.isOpen$.value;
    this.isOpen$.next(newState);

    // Close select when clicking outside
    if (newState) {
      // Remove any existing listener first
      if (this.closeSelectListener) {
        document.removeEventListener('click', this.closeSelectListener);
      }

      setTimeout(() => {
        this.closeSelectListener = (event: MouseEvent) => {
          // Use unique component ID to ensure we're targeting the correct element
          const componentElement = document.getElementById(
            `color-select-${this.componentId}`
          );
          if (!componentElement?.contains(event.target as Node)) {
            this.isOpen$.next(false);
            if (this.closeSelectListener) {
              document.removeEventListener('click', this.closeSelectListener);
              this.closeSelectListener = null;
            }
          }
        };
        document.addEventListener('click', this.closeSelectListener);
      }, 0);
    } else {
      // Clean up listener when closing
      if (this.closeSelectListener) {
        document.removeEventListener('click', this.closeSelectListener);
        this.closeSelectListener = null;
      }
    }
  }

  selectOption(option: ColorOption) {
    this.selectedValue = option.value;
    this.formControl.setValue(option.value);

    // Trigger validation
    this.formControl.markAsDirty();
    this.formControl.updateValueAndValidity();

    setTimeout(() => {
      this.isOpen$.next(false);

      // Clean up listener when selecting an option
      if (this.closeSelectListener) {
        document.removeEventListener('click', this.closeSelectListener);
        this.closeSelectListener = null;
      }
    });
  }
}
