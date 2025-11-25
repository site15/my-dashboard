import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FieldArrayType, FormlyField } from '@ngx-formly/core';

@Component({
  selector: 'formly-repeat-type',
  template: `
    <article>
      <header>
        <hgroup>
          <h5 *ngIf="props.label">{{ props.label }}</h5>
          <p *ngIf="props.description">{{ props.description }}</p>
        </hgroup>
      </header>

      @for (field of field.fieldGroup; track $index) {
        <fieldset class="grid">
          <formly-field [field]="field"></formly-field>
        </fieldset>
      }

      <footer>
        <button type="button" (click)="add()">
          {{ props['addText'] }}
        </button>
      </footer>
    </article>
  `,
  standalone: true,
  imports: [NgIf, FormlyField],
})
export class RepeatTypeComponent extends FieldArrayType {}
