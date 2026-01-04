import { Component } from '@angular/core';

@Component({
  selector: 'app-tailwind-test',
  standalone: true,
  template: `
    <div
      class="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4"
    >
      <div
        class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full"
      >
        <h1
          class="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6"
        >
          Tailwind CSS Test
        </h1>
        <p class="text-gray-600 dark:text-gray-300 text-center mb-8">
          If you see styled elements below, Tailwind CSS is working correctly.
        </p>

        <!-- Test elements -->
        <div class="space-y-4 mb-6">
          <div class="p-4 bg-blue-500 text-white rounded-lg">
            Standard blue background (bg-blue-500)
          </div>
          <div class="p-4 bg-pastel-blue text-white rounded-lg">
            Pastel blue background (bg-pastel-blue)
          </div>
          <div
            class="p-4 text-pastel-blue rounded-lg border border-pastel-blue"
          >
            Pastel blue text (text-pastel-blue)
          </div>
          <div class="m-4 border-2 border-green-500 p-3 rounded">
            Margin and border test (m-4)
          </div>
          <div
            class="flex items-center justify-between p-3 bg-yellow-100 dark:bg-yellow-900 rounded"
          >
            <span class="text-gray-800 dark:text-yellow-100">Flexbox test</span>
            <span class="bg-red-500 text-white px-2 py-1 rounded text-sm"
              >Badge</span
            >
          </div>
        </div>

        <button
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
        >
          Interactive Button Test
        </button>
      </div>
    </div>
  `,
})
export default class TailwindTestPageComponent {}
