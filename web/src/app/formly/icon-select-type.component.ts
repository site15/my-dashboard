import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { createIcons, icons } from 'lucide';
import { BehaviorSubject } from 'rxjs';

import { isSSR } from '../../server/utils/is-ssr';

interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'formly-icon-select-type',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Custom select with icons -->
    <div
      class="custom-select flat-input"
      [id]="'icon-select-' + componentId"
      [class.open]="(isOpen$ | async) === true"
      (click)="toggleSelect()"
    >
      <div class="selected-option">
        <ng-container *ngIf="selectedIcon; else placeholderTemplate">
          <i [attr.data-lucide]="selectedIcon" class="w-5 h-5 mr-2"></i>
          <span>{{ getSelectedLabel() }}</span>
        </ng-container>
        <ng-template #placeholderTemplate>
          <span>{{ props.placeholder || 'Select an option' }}</span>
        </ng-template>
        <i data-lucide="chevron-down" class="w-5 h-5 ml-auto"></i>
      </div>

      <div class="options-dropdown" *ngIf="(isOpen$ | async) === true">
        <div
          class="option-item"
          *ngFor="let option of getOptions()"
          (click)="selectOption(option)"
          [class.selected]="option.value === selectedValue"
        >
          <i [attr.data-lucide]="option.value" class="w-5 h-5 mr-2"></i>
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
  styles: [
    `
      .custom-select {
        position: relative;
        cursor: pointer;
        min-height: 40px;
        display: flex;
        align-items: center;
        width: 100%;
        padding: 1rem;
        border-radius: 0.75rem;
        background-color: white;
        border: 1px solid #e5e7eb;
        transition: all 0.3s ease;
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.03);
      }

      .custom-select:focus,
      .custom-select.open {
        border-color: transparent;
        box-shadow: 0 0 0 3px rgba(138, 137, 240, 0.5);
      }

      .selected-option {
        display: flex;
        align-items: center;
        width: 100%;
      }

      .options-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background-color: white;
        border: 1px solid #e5e7eb;
        border-top: none;
        border-radius: 0 0 0.75rem 0.75rem;
        box-shadow:
          0 4px 6px -1px rgba(0, 0, 0, 0.1),
          0 2px 4px -1px rgba(0, 0, 0, 0.06);
        max-height: 200px;
        overflow-y: auto;
        z-index: 100;
      }

      .option-item {
        display: flex;
        align-items: center;
        padding: 0.5rem;
        cursor: pointer;
      }

      .option-item:hover {
        background-color: #f3f4f6;
      }

      .option-item.selected {
        background-color: #dbeafe;
      }

      .hidden {
        display: none;
      }
    `,
  ],
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule, AsyncPipe],
})
export class IconSelectTypeComponent
  extends FieldType<FieldTypeConfig>
  implements OnInit
{
  selectedIcon: string = '';
  selectedValue: string = '';

  // Use BehaviorSubject for isOpen to enable reactive updates
  isOpen$ = new BehaviorSubject<boolean>(false);

  // Unique ID for this component instance
  componentId = Math.random().toString(36).substring(2, 15);

  // Store reference to the close listener so we can remove it properly
  private closeSelectListener: ((event: MouseEvent) => void) | null = null;

  ngOnInit() {
    // Установим начальное значение, если оно есть
    if (this.formControl.value) {
      this.selectedValue = this.formControl.value;
      this.selectedIcon = this.formControl.value;
      this.updateIcon();
    }
  }

  getOptions(): SelectOption[] {
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

    // Закрыть селект при клике вне его
    if (newState) {
      // Remove any existing listener first
      if (this.closeSelectListener) {
        document.removeEventListener('click', this.closeSelectListener);
      }

      setTimeout(() => {
        this.closeSelectListener = (event: MouseEvent) => {
          // Use unique component ID to ensure we're targeting the correct element
          const componentElement = document.getElementById(
            `icon-select-${this.componentId}`
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

    // Обновим иконки
    if (!isSSR) {
      setTimeout(() => {
        createIcons({ icons });
      }, 0);
    }
  }

  selectOption(option: SelectOption) {
    this.selectedValue = option.value;
    this.selectedIcon = option.value;
    this.formControl.setValue(option.value);
    setTimeout(() => {
      this.isOpen$.next(false);
      this.updateIcon();

      // Clean up listener when selecting an option
      if (this.closeSelectListener) {
        document.removeEventListener('click', this.closeSelectListener);
        this.closeSelectListener = null;
      }
    });
  }

  updateIcon() {
    if (!isSSR) {
      // Обновим иконку с помощью Lucide
      setTimeout(() => {
        createIcons({ icons });
      }, 0);
    }
  }
}
