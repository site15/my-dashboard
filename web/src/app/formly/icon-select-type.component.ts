import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { createIcons, icons } from 'lucide';
import { isSSR } from '../../server/utils/is-ssr';

interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'formly-icon-select-type',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label [attr.for]="id" class="form-label" *ngIf="props.label">
      {{ props.label }}
      <span *ngIf="props.required">*</span>
    </label>

    <!-- Custom select with icons -->
    <div class="custom-select" [class.open]="isOpen" (click)="toggleSelect()">
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

      <div class="options-dropdown" *ngIf="isOpen">
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
        border: 1px solid #ddd;
        border-radius: 0.375rem;
        background-color: white;
        cursor: pointer;
        min-height: 40px;
        display: flex;
        align-items: center;
      }

      .custom-select.open {
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
      }

      .selected-option {
        display: flex;
        align-items: center;
        padding: 0.5rem;
        width: 100%;
      }

      .options-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background-color: white;
        border: 1px solid #ddd;
        border-top: none;
        border-radius: 0 0 0.375rem 0.375rem;
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
  imports: [NgIf, NgFor, ReactiveFormsModule],
})
export class IconSelectTypeComponent
  extends FieldType<FieldTypeConfig>
  implements OnInit
{
  selectedIcon: string = '';
  selectedValue: string = '';
  isOpen: boolean = false;

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
    this.isOpen = !this.isOpen;

    // Закрыть селект при клике вне его
    if (this.isOpen) {
      setTimeout(() => {
        const closeSelect = (event: MouseEvent) => {
          if (
            !document
              .querySelector('.custom-select')
              ?.contains(event.target as Node)
          ) {
            this.isOpen = false;
            document.removeEventListener('click', closeSelect);
          }
        };
        document.addEventListener('click', closeSelect);
      }, 0);
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
    this.isOpen = false;
    this.updateIcon();
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
