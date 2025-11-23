/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormlyFieldConfig } from '@ngx-formly/core';

import { ButtonTypeComponent } from './button-type.component';
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

              // 1. удалить контрол из FormArray (если он есть)
              const formArray = arrayField.formControl;
              if (formArray && typeof formArray.removeAt === 'function') {
                try {
                  formArray.removeAt(itemIndex);
                } catch (e) {
                  // игнорируем, но логируем для отладки
                  console.warn('removeAt failed', e);
                }
              }

              // 2. удалить конфиг поля из fieldGroup (чтобы Formly UI обновился)
              if (Array.isArray(arrayField.fieldGroup)) {
                arrayField.fieldGroup.splice(itemIndex, 1);
              }

              // 3. удалить элемент из модели (если модель — массив)
              if (Array.isArray(arrayField.model)) {
                arrayField.model.splice(itemIndex, 1);
              }

              for (let i = itemIndex; i < arrayField.fieldGroup.length; i++) {
                const field = arrayField.fieldGroup[i];
                if (field && field.key) {
                  field.key = `${field.key}-${i}`;
                }
              }
            },
          },
        },
      ];
    }
    return f;
  }) as T[];
}
