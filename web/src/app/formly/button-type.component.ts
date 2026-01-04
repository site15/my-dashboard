import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'formly-button-type',
  template: `<label class="form-label">&nbsp;</label>
    <button
      style="width: 100%;"
      [type]="props['buttonType'] || 'button'"
      [class]="
        props['class'] ||
        'flex items-center justify-center text-lg font-bold py-3 px-6 rounded-xl text-white bg-pastel-blue transition-all duration-300 transform hover:scale-[1.02] flat-btn-shadow bg-gradient-to-tr from-[#8A89F0] to-[#A2C0F5] tracking-wide'
      "
      (click)="buttonClick()"
    >
      <span *ngIf="props.label">{{ props.label }}</span>
    </button>`,
  standalone: true,
  // todo: add onPush change detection strategy
  // changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, LucideAngularModule],
})
export class ButtonTypeComponent extends FieldArrayType {
  buttonClick() {
    this.props['buttonClick'](this);
  }
}
