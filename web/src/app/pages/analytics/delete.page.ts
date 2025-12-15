import { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

import { ShowNavGuard } from '../../guards/nav.guard';

export const routeMeta: RouteMeta = {
  canActivate: [ShowNavGuard],
};

@Component({
  selector: 'analytics-delete-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule, ReactiveFormsModule],
  template: `
    <h1 class="text-4xl font-extrabold text-gray-800 mb-2">
      Delete Analytics Data
    </h1>
    <p class="text-xl text-gray-500 mb-8">
      <a
        href="/analytics"
        class="text-gray-500 hover:text-pastel-blue transition-colors mb-10 mt-2 flex items-center"
      >
        <i-lucide name="arrow-left" class="w-6 h-6 mr-0 lg:mr-2"></i-lucide>
        <span class="hidden lg:inline text-lg font-medium">Back to Analytics</span>
      </a>
      Permanently remove analytics data.
    </p>

    <!-- Analytics Data Deletion Panel -->
    <div class="bg-white p-6 rounded-2xl long-shadow mb-8 space-y-4">
      <form
        [formGroup]="form"
        (ngSubmit)="onSubmit()"
        class="w-full"
      >
        <div class="mb-6">
          <p class="text-lg text-gray-700 mb-2">
            Are you sure you want to delete all analytics data?
          </p>
          <p class="text-gray-500">
            This action cannot be undone. All collected analytics data will be permanently removed.
          </p>
        </div>

        <div class="flex gap-4">
          <a
            href="/analytics"
            class="flex items-center text-lg font-bold py-3 px-6 rounded-xl text-white bg-gray-500 transition-all duration-300 transform hover:scale-[1.02] flat-btn-shadow mb-8 
              bg-gradient-to-tr from-[#AAB1BF] to-[#8B92A0] tracking-wide cursor-pointer"
          >
            <i-lucide name="x" class="w-5 h-5 mr-2"></i-lucide>
            Cancel
          </a>

          <button
            type="submit"
            class="flex items-center text-lg font-bold py-3 px-6 rounded-xl text-white transition-all duration-300 transform hover:scale-[1.02] flat-btn-shadow mb-8 
              bg-gradient-to-tr from-[#FF988A] to-[#FFD5A2] text-gray-800 cursor-pointer"
          >
            <i-lucide name="trash-2" class="w-5 h-5 mr-2"></i-lucide>
            Delete Analytics Data
          </button>
        </div>
      </form>
    </div>
  `,
})
export default class AnalyticsDeletePageComponent {
  form = new UntypedFormGroup({});

  onSubmit() {
    alert('Analytics data deleted successfully!');
    // In a real application, this would call a service to delete the data
  }
}