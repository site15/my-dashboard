/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormlyFieldConfig, FormlyFieldProps } from '@ngx-formly/core';

import { ClientValidationErrorType } from '../../server/types/client-error-type';

export function appendServerErrorsAsValidatorsToFields({
  clientError,
  formFields,
}: {
  clientError?: ClientValidationErrorType;
  formFields: FormlyFieldConfig<
    FormlyFieldProps & { [additionalProperties: string]: any }
  >[];
}) {
  formFields.forEach((f: FormlyFieldConfig) => {
    const error = clientError?.fields?.find(e => e.path === f.key);
    if (error) {
      f.validators = {
        validation_error: {
          expression: () => false,
          message: () => error.message,
        },
      };
    }
  });
  return formFields;
}
