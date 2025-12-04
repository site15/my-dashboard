import { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';

export const routeMeta: RouteMeta = {
  title: 'Checkbox Test',
};

@Component({
  selector: 'checkbox-test-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-gray-50 py-12">
      <div class="max-w-4xl mx-auto px-4">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Checkbox Test</h1>
        <p class="text-xl text-gray-600 mb-8">Testing custom checkbox styling</p>

        <div class="bg-white rounded-2xl long-shadow p-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">Checkbox Styles</h2>
          
          <div class="space-y-4">
            <div class="flex items-center">
              <input type="checkbox" id="checkbox1" class="flat-checkbox">
              <label for="checkbox1" class="ml-2 text-gray-700">Unchecked checkbox</label>
            </div>
            
            <div class="flex items-center">
              <input type="checkbox" id="checkbox2" class="flat-checkbox" checked>
              <label for="checkbox2" class="ml-2 text-gray-700">Checked checkbox</label>
            </div>
            
            <div class="flex items-center">
              <input type="checkbox" id="checkbox3" class="flat-checkbox" disabled>
              <label for="checkbox3" class="ml-2 text-gray-700">Disabled checkbox</label>
            </div>
          </div>
          
          <h3 class="text-xl font-bold text-gray-800 mt-8 mb-4">Comparison with Input</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-lg font-medium text-gray-700 mb-2">Input Field</label>
              <input type="text" class="flat-input" placeholder="Sample input">
            </div>
            
            <div>
              <label class="block text-lg font-medium text-gray-700 mb-2">Checkbox</label>
              <div class="flex items-center">
                <input type="checkbox" id="checkbox4" class="flat-checkbox">
                <label for="checkbox4" class="ml-2 text-gray-700">Sample checkbox</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export default class CheckboxTestPageComponent {}