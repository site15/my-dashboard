import { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

import { ShowNavGuard } from '../guards/nav.guard';

export const routeMeta: RouteMeta = {
  canActivate: [ShowNavGuard],
};

@Component({
  selector: 'home-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  template: `
    <h1 class="text-4xl font-extrabold text-gray-800 mb-2">Dashboard System</h1>
    <p class="text-xl text-gray-500 mb-8">
      Manage your information on old Android devices
    </p>

    <div class="bg-white p-6 rounded-2xl long-shadow mb-8">
      <div class="flex items-start mb-4">
        <i-lucide
          name="smartphone"
          class="w-10 h-10 text-pastel-blue bg-pastel-blue/10 rounded-lg"
        >
        </i-lucide>
        <div>
          <h3 class="text-2xl font-bold text-gray-800 mb-2">Project Goal</h3>
          <p class="text-gray-600">
            Creating a dashboard management system for displaying information on
            old Android phones.
          </p>
        </div>
      </div>

      <div class="flex items-start mb-4">
        <i-lucide
          name="mouse-pointer-click"
          class="w-10 h-10 text-pastel-blue bg-pastel-blue/10 rounded-lg"
        >
        </i-lucide>
        <div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">How It Works</h3>
          <p class="text-gray-600">
            Users create dashboards through a web application, add widgets, and
            bind phones via QR code.
          </p>
        </div>
      </div>

      <div class="flex items-start">
        <i-lucide
          name="zap"
          class="w-10 h-10 text-pastel-blue bg-pastel-blue/10 rounded-lg"
        >
        </i-lucide>
        <div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">
            Real-time Updates
          </h3>
          <p class="text-gray-600">
            The phone receives data through an API and displays widgets in
            real-time.
          </p>
        </div>
      </div>
    </div>

    <div class="bg-white p-6 rounded-2xl long-shadow">
      <h3 class="text-xl font-bold text-gray-800 mb-4">Getting Started</h3>
      <div class="flex flex-col sm:flex-row gap-4">
        <a
          href="/dashboards/new"
          class="flex items-center justify-center text-lg font-bold py-3 px-6 rounded-xl text-white bg-pastel-blue transition-all duration-300 transform hover:scale-[1.02] flat-btn-shadow bg-gradient-to-tr from-[#8A89F0] to-[#A2C0F5] tracking-wide"
        >
          <i-lucide name="layout-dashboard" class="w-5 h-5 mr-2"></i-lucide>
          Create Your First Dashboard
        </a>
        <a
          href="/documentation"
          class="flex items-center justify-center text-lg font-bold py-3 px-6 rounded-xl text-white bg-gray-500 transition-all duration-300 transform hover:scale-[1.02] flat-btn-shadow bg-gradient-to-tr from-[#AAB1BF] to-[#8B92A0] tracking-wide"
        >
          <i-lucide name="book-open" class="w-5 h-5 mr-2"></i-lucide>
          View Documentation
        </a>
      </div>
    </div>
  `,
})
export default class HomePageComponent {
  showError() {
    alert('Documentation is coming soon!');
  }
}
