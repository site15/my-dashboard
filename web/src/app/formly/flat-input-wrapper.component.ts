import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-flat-input-wrapper',
  template: `
    <div>
      <label [attr.for]="id" class="block text-lg font-medium text-gray-700 mb-2" *ngIf="props.label">
        {{ props.label }}
        <span *ngIf="props.required">*</span>
      </label>
      <ng-template #fieldComponent></ng-template>
      <small *ngIf="props.description" class="form-text">{{
        props.description
      }}</small>
    </div>
  `,
  standalone: true,
  // todo: add onPush change detection strategy
  // changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf],
})
export class FlatInputWrapperComponent extends FieldWrapper {}