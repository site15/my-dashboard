import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';

@Component({
  selector: 'formly-button-type',
  template: `<label class="form-label">&nbsp;</label>
    <button
      style="width: 100%;"
      [type]="props['buttonType'] || 'button'"
      [class]="props['class']"
      (click)="buttonClick()"
    >
      <span *ngIf="props.label">{{ props.label }}</span>
    </button>`,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf],
})
export class ButtonTypeComponent extends FieldArrayType {
  buttonClick() {
    this.props['buttonClick'](this);
  }
}
