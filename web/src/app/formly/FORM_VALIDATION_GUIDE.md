# Formly Custom Validation Guide

This guide explains how to implement and use custom validation functions in Formly forms within the My Dashboard project.

## Overview

The project includes a set of reusable custom validator functions that can be applied to Formly fields. These validators help ensure data integrity and provide better user experience through immediate feedback.

## Available Validators

### Built-in Validators

1. **alphanumericValidator** - Ensures field contains only letters and numbers
2. **emailValidator** - Validates email format
3. **notEmptyValidator** - Ensures field is not empty (including whitespace-only values)
4. **minLengthValidator(minLength)** - Ensures minimum length requirement
5. **maxLengthValidator(maxLength)** - Ensures maximum length requirement
6. **patternValidator(pattern, patternName)** - Validates against a regular expression
7. **rangeValidator(min, max)** - Ensures numeric values are within a range
8. **matchValidator(fieldName, matchFieldName)** - Validates that two fields match (e.g., password confirmation)

## How to Use Custom Validators

### Method 1: Using the `applyCustomValidators` Utility Function

This is the recommended approach for applying validators to multiple fields at once:

```typescript
import { FormlyFieldConfig } from '@ngx-formly/core';
import { applyCustomValidators } from '../utils/form-validators';

export const FORM_FIELDS: FormlyFieldConfig[] = applyCustomValidators([
  {
    key: 'name',
    type: 'input',
    props: {
      label: 'Full Name',
      placeholder: 'Enter your full name',
      required: true
    }
  },
  {
    key: 'email',
    type: 'input',
    props: {
      label: 'Email Address',
      placeholder: 'Enter your email',
      required: true
    }
  },
  {
    key: 'username',
    type: 'input',
    props: {
      label: 'Username',
      placeholder: 'Choose a username',
      required: true
    }
  }
], {
  'name': ['notEmpty'],
  'email': ['email', 'notEmpty'],
  'username': ['alphanumeric', 'notEmpty']
});
```

### Method 2: Adding Validators Directly to Field Configurations

You can also add validators directly to individual field configurations:

```typescript
import { alphanumericValidator, emailValidator, notEmptyValidator } from '../utils/form-validators';

export const FORM_FIELDS: FormlyFieldConfig[] = [
  {
    key: 'name',
    type: 'input',
    props: {
      label: 'Full Name',
      placeholder: 'Enter your full name',
      required: true
    },
    validators: {
      notEmpty: {
        expression: (ctrl) => notEmptyValidator(ctrl) === null,
        message: () => 'Name is required'
      }
    }
  },
  {
    key: 'email',
    type: 'input',
    props: {
      label: 'Email Address',
      placeholder: 'Enter your email',
      required: true
    },
    validators: {
      email: {
        expression: (ctrl) => emailValidator(ctrl) === null,
        message: () => 'Please enter a valid email address'
      },
      notEmpty: {
        expression: (ctrl) => notEmptyValidator(ctrl) === null,
        message: () => 'Email is required'
      }
    }
  }
];
```

### Method 3: Implementing Validation in Custom Components

For custom Formly components, you can implement validation directly in the component:

```typescript
import { notEmptyValidator } from '../utils/form-validators';

@Component({
  // ... component configuration
})
export class CustomFormlyComponent extends FieldType<FieldTypeConfig> {
  selectOption(option: any) {
    this.formControl.setValue(option.value);
    
    // Trigger validation
    this.formControl.markAsDirty();
    this.formControl.updateValueAndValidity();
    
    // Run custom validation if required
    if (this.props.required) {
      const isValid = notEmptyValidator(this.formControl) === null;
      if (!isValid) {
        this.formControl.setErrors({ required: true });
      }
    }
  }
}
```

## Adding Custom Validators to Existing Forms

To add custom validators to existing forms in the project:

1. Import the necessary validator functions:
```typescript
import { applyCustomValidators } from '../utils/form-validators';
```

2. Wrap your existing field configurations with `applyCustomValidators`:
```typescript
export const DASHBOARD_FORMLY_FIELDS: FormlyFieldConfig[] = applyCustomValidators([
  // ... existing field configurations
], {
  // ... field-specific validators
  'name': ['notEmpty']
});
```

## Validation Messages

Custom validators automatically provide meaningful error messages. You can customize these messages by providing your own in the validator configuration:

```typescript
validators: {
  alphanumeric: {
    expression: (ctrl) => alphanumericValidator(ctrl) === null,
    message: () => 'Username can only contain letters and numbers'
  }
}
```

## Displaying Validation Errors

The project includes a custom `flat-input-wrapper` component that automatically displays validation errors for form fields. To use it:

1. Add the `flat-input-wrapper` to your field configuration:
```typescript
{
  key: 'name',
  type: 'input',
  wrappers: ['flat-input-wrapper'],
  props: {
    label: 'Name',
    placeholder: 'Enter name',
    required: true
  }
}
```

2. Make sure to use the `mapFormlyTypes` function to properly map the wrapper:
```typescript
import { mapFormlyTypes } from '../formly/get-formly-type';

const fields = mapFormlyTypes(formFields);
```

The wrapper will automatically display validation errors when:
- The field has been touched (user has interacted with it)
- The field has validation errors
- The form control is invalid

## Best Practices

1. **Use `applyCustomValidators` for consistency** - This ensures all validators are applied uniformly across the application.

2. **Validate on user interaction** - Always trigger validation when users interact with form controls:
```typescript
this.formControl.markAsDirty();
this.formControl.updateValueAndValidity();
```

3. **Handle validation errors gracefully** - Make sure to display validation errors in a user-friendly way.

4. **Test validators thoroughly** - Ensure validators work correctly with various input scenarios including edge cases.