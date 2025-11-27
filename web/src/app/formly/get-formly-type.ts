/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormlyFieldConfig } from '@ngx-formly/core';

import { ButtonTypeComponent } from './button-type.component';
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

    if (Array.isArray(f.fieldGroup)) {
      f.fieldGroup = mapFormlyTypes(f.fieldGroup);
    }

    if ((f.fieldArray as any)?.fieldGroup) {
      (f.fieldArray as any).fieldGroup = [
        ...mapFormlyTypes((f.fieldArray as any)?.fieldGroup || []),
        {
          type: ButtonTypeComponent,
          props: {
            label: 'Delete',
            class: 'secondary',
            buttonClick: (vm: any) => {
              const itemIndex = +vm.field?.parent.key;
              const arrayField = vm.field?.parent.parent;
              console.log({ itemIndex, arrayField });

              // 1. remove control from FormArray (if it exists)
              const formArray = arrayField.formControl;
              if (formArray && typeof formArray.removeAt === 'function') {
                try {
                  formArray.removeAt(itemIndex);
                } catch (error) {
                  console.error('Error removing form control:', error);
                }
              }

              // 2. remove field from fieldGroup
              arrayField.fieldGroup.splice(itemIndex, 1);

              // 3. update parent formControl
              if (arrayField.model && Array.isArray(arrayField.model)) {
                arrayField.model.splice(itemIndex, 1);
              }
            },
          },
        },
      ];
    }

    return f;
  });
}