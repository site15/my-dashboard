import { Component } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';

import { ColorSelectTypeComponent } from '../formly/color-select-type.component';
import { IconSelectTypeComponent } from '../formly/icon-select-type.component';

@Component({
  selector: 'app-theme-components-test',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormlyModule,
    ColorSelectTypeComponent,
    IconSelectTypeComponent,
  ],
  template: `
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-2xl w-full">
        <h1 class="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">Themed Components Test</h1>
        <p class="text-gray-600 dark:text-gray-300 text-center mb-8">
          Testing themed color and icon select components in both light and dark modes.
        </p>
        
        <form [formGroup]="form" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Color Select Test -->
            <div class="space-y-2">
              <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-200">Color Select Component</h2>
              <formly-field [fields]="colorFields"></formly-field>
            </div>
            
            <!-- Icon Select Test -->
            <div class="space-y-2">
              <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-200">Icon Select Component</h2>
              <formly-field [fields]="iconFields"></formly-field>
            </div>
          </div>
          
          <!-- Form Data Display -->
          <div class="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Form Data</h3>
            <pre class="text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 p-3 rounded overflow-x-auto">{{ form.value | json }}</pre>
          </div>
        </form>
        
        <div class="mt-8 text-center">
          <p class="text-gray-600 dark:text-gray-400">
            Switch between light and dark themes using the theme toggle in the navigation sidebar to see the components adapt.
          </p>
        </div>
      </div>
    </div>
  `,
})
export default class ThemeComponentsTestPageComponent {
  form = new UntypedFormGroup({});
  
  colorFields: FormlyFieldConfig[] = [
    {
      key: 'selectedColor',
      type: 'color-select',
      props: {
        label: 'Choose a color',
        placeholder: 'Select a color',
        options: [
          { value: 'blue', label: 'Blue' },
          { value: 'orange', label: 'Orange' },
          { value: 'purple', label: 'Purple' },
          { value: 'green', label: 'Green' },
          { value: 'red', label: 'Red' },
          { value: 'yellow', label: 'Yellow' },
          { value: 'pink', label: 'Pink' },
        ],
      },
    },
  ];
  
  iconFields: FormlyFieldConfig[] = [
    {
      key: 'selectedIcon',
      type: 'icon-select',
      props: {
        label: 'Choose an icon',
        placeholder: 'Select an icon',
        options: [
          { value: 'droplet', label: 'Water' },
          { value: 'utensils', label: 'Food' },
          { value: 'pill', label: 'Medication' },
          { value: 'dumbbell', label: 'Exercise' },
          { value: 'coffee', label: 'Coffee' },
          { value: 'glass-water', label: 'Glass of Water' },
          { value: 'apple', label: 'Apple' },
          { value: 'heart-pulse', label: 'Heart Rate' },
          { value: 'book', label: 'Reading' },
          { value: 'music', label: 'Music' },
        ],
      },
    },
  ];
}