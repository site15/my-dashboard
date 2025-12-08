/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormlyFieldConfig, FormlyFieldProps } from '@ngx-formly/core';

import { ClientValidationErrorType } from '../../server/types/client-error-type';

export function appendServerErrorsAsValidatorsToFields({
  clientError,
  formFields,
  rootPath,
  groupErrors,
}: {
  clientError?: ClientValidationErrorType;
  formFields: FormlyFieldConfig<
    FormlyFieldProps & { [additionalProperties: string]: any }
  >[];
  rootPath?: string;
  groupErrors?: (string | null | undefined)[];
}) {
  if (clientError?.event === 'validation_error') {
    let clientErrorFields = clientError?.fields;
    if (rootPath) {
      clientErrorFields = clientErrorFields.filter(e =>
        e.path.startsWith(rootPath + '.')
      );
      for (let index = 0; index < clientErrorFields.length; index++) {
        clientErrorFields[index].path = clientErrorFields[index].path.replace(
          rootPath + '.',
          ''
        );
      }
    }

    formFields.forEach((f: FormlyFieldConfig) => {
      if (f.fieldGroup) {
        ///
        appendServerErrorsAsValidatorsToFields({
          clientError: { ...clientError, fields: clientErrorFields },
          formFields: f.fieldGroup || [],
          rootPath: String(f.key),
          groupErrors: clientErrorFields.find(e => e.path === f.key)?.message,
        });
      } else {
        const error = clientErrorFields?.find(e => e.path === f.key);
        if (error || (clientErrorFields.length === 0 && groupErrors)) {
          f.validators = {
            validation_error: {
              expression: () => false,
              message: () => error?.message || groupErrors,
            },
          };
        } else {
          f.validators = undefined;
        }
      }
    });
  }
  return formFields;
}
