 
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormlyFieldConfig } from '@ngx-formly/core';

import { ButtonTypeComponent } from './button-type.component';
import { ColorSelectTypeComponent } from './color-select-type.component';
import { FlatInputWrapperComponent } from './flat-input-wrapper.component';
import { IconSelectTypeComponent } from './icon-select-type.component';
import { RepeatTypeComponent } from './repeat-type.component';

export function mapFormlyTypes<T extends FormlyFieldConfig = FormlyFieldConfig>(
  fields: T[]
) {
  return fields.map((f: T): T => {
    if (f.type === 'repeat') {
      f.type = RepeatTypeComponent;
    }

    if (f.type === 'button') {
      f.type = ButtonTypeComponent;
    }

    if (f.type === 'icon-select') {
      f.type = IconSelectTypeComponent;
    }

    if (f.type === 'color-select') {
      f.type = ColorSelectTypeComponent;
    }

    if (f.wrappers) {
      f.wrappers = f.wrappers.map(wrapper =>
        wrapper === 'flat-input-wrapper' ? FlatInputWrapperComponent : wrapper
      );
    }

    if (Array.isArray(f.fieldGroup)) {
      f.fieldGroup = mapFormlyTypes(f.fieldGroup);
    }

    if ((f.fieldArray as any)?.fieldGroup) {
      (f.fieldArray as any).fieldGroup = [
        ...mapFormlyTypes((f.fieldArray as any)?.fieldGroup || []),
      ];
    }

    return f;
  });
}
