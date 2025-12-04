import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldArrayType, FormlyField } from '@ngx-formly/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'formly-repeat-type',
  template: `
    <article class="mb-6">
      <header>
        <hgroup>
          <h5 *ngIf="props.label" class="text-lg font-medium text-gray-700 mb-2">{{ props.label }}</h5>
          <p *ngIf="props.description" class="text-sm text-gray-600 mb-4">{{ props.description }}</p>
        </hgroup>
      </header>

      @for (field of field.fieldGroup; track $index) {
        <fieldset class="grid mb-4 p-4 bg-white rounded-xl border border-gray-200 dark:border-gray-700">
          <formly-field [field]="field"></formly-field>
          <div class="mt-2">
            <button 
              type="button" 
              (click)="remove($index)"
              class="flex items-center text-base font-bold py-2 px-4 rounded-lg text-white bg-red-500 transition-all duration-300 transform hover:scale-[1.02] flat-btn-shadow bg-gradient-to-tr from-[#FF988A] to-[#FFD5A2] tracking-wide"
            >
              <i-lucide name="trash-2" class="w-4 h-4 mr-1"></i-lucide>
              Remove
            </button>
          </div>
        </fieldset>
      }

      <footer>
        <button 
          type="button" 
          (click)="add()"
          class="flex items-center text-base font-bold py-2 px-4 rounded-lg text-white bg-pastel-blue transition-all duration-300 transform hover:scale-[1.02] flat-btn-shadow mb-4 
            bg-gradient-to-tr from-[#8A89F0] to-[#A2C0F5] tracking-wide"
        >
          <i-lucide name="plus" class="w-4 h-4 mr-1"></i-lucide>
          {{ props['addText'] }}
        </button>
      </footer>
    </article>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, FormlyField, LucideAngularModule],
})
export class RepeatTypeComponent extends FieldArrayType {}
