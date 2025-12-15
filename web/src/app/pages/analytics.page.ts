import { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

import { ShowNavGuard } from '../guards/nav.guard';

export const routeMeta: RouteMeta = {
  canActivate: [ShowNavGuard],
};

@Component({
  selector: 'analytics-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  template: `
    <h1 class="text-4xl font-extrabold text-gray-800 mb-2">Analytics (Mock)</h1>
    <p class="text-xl text-gray-500 mb-8">Track your dashboard usage and performance</p>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Usage Statistics Card -->
      <div class="bg-white p-6 rounded-2xl long-shadow">
        <div class="flex items-center mb-4">
          <i-lucide 
            name="chart-bar-big" 
            class="w-10 h-10 text-pastel-blue bg-pastel-blue/10 rounded-lg">
          </i-lucide>
          <h2 class="text-2xl font-bold text-gray-800">Usage Statistics</h2>
        </div>
        
        <div class="space-y-4">
          <div class="flex justify-between items-center pb-2 border-b border-gray-100">
            <span class="text-gray-600">Total Dashboards</span>
            <span class="text-2xl font-bold text-pastel-blue">12</span>
          </div>
          
          <div class="flex justify-between items-center pb-2 border-b border-gray-100">
            <span class="text-gray-600">Active Devices</span>
            <span class="text-2xl font-bold text-pastel-blue">8</span>
          </div>
          
          <div class="flex justify-between items-center pb-2 border-b border-gray-100">
            <span class="text-gray-600">Widgets Deployed</span>
            <span class="text-2xl font-bold text-pastel-blue">42</span>
          </div>
          
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Avg. Updates/Day</span>
            <span class="text-2xl font-bold text-pastel-blue">127</span>
          </div>
        </div>
      </div>
      
      <!-- Device Performance Card -->
      <div class="bg-white p-6 rounded-2xl long-shadow">
        <div class="flex items-center mb-4">
          <i-lucide 
            name="smartphone" 
            class="w-10 h-10 text-pastel-blue bg-pastel-blue/10 rounded-lg">
          </i-lucide>
          <h2 class="text-2xl font-bold text-gray-800">Device Performance</h2>
        </div>
        
        <div class="space-y-4">
          <div class="flex justify-between items-center pb-2 border-b border-gray-100">
            <span class="text-gray-600">Avg. Response Time</span>
            <span class="text-2xl font-bold text-pastel-blue">24ms</span>
          </div>
          
          <div class="flex justify-between items-center pb-2 border-b border-gray-100">
            <span class="text-gray-600">Uptime</span>
            <span class="text-2xl font-bold text-pastel-blue">99.8%</span>
          </div>
          
          <div class="flex justify-between items-center pb-2 border-b border-gray-100">
            <span class="text-gray-600">Offline Events</span>
            <span class="text-2xl font-bold text-pastel-blue">3</span>
          </div>
          
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Cache Hit Rate</span>
            <span class="text-2xl font-bold text-pastel-blue">87%</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Recent Activity Section -->
    <div class="bg-white p-6 rounded-2xl long-shadow mb-8">
      <div class="flex items-center mb-4">
        <i-lucide 
          name="activity" 
          class="w-10 h-10 text-pastel-blue bg-pastel-blue/10 rounded-lg">
        </i-lucide>
        <h2 class="text-2xl font-bold text-gray-800">Recent Activity</h2>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="text-left text-gray-500 border-b border-gray-100">
              <th class="pb-3">Time</th>
              <th class="pb-3">Device</th>
              <th class="pb-3">Action</th>
              <th class="pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-gray-100 hover:bg-gray-50">
              <td class="py-3 text-gray-600">2 hours ago</td>
              <td class="py-3">Kitchen Display</td>
              <td class="py-3">Dashboard Update</td>
              <td class="py-3">
                <span class="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Success</span>
              </td>
            </tr>
            <tr class="border-b border-gray-100 hover:bg-gray-50">
              <td class="py-3 text-gray-600">5 hours ago</td>
              <td class="py-3">Living Room Tablet</td>
              <td class="py-3">Widget Added</td>
              <td class="py-3">
                <span class="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Success</span>
              </td>
            </tr>
            <tr class="border-b border-gray-100 hover:bg-gray-50">
              <td class="py-3 text-gray-600">1 day ago</td>
              <td class="py-3">Bedroom Phone</td>
              <td class="py-3">Settings Changed</td>
              <td class="py-3">
                <span class="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Warning</span>
              </td>
            </tr>
            <tr class="border-b border-gray-100 hover:bg-gray-50">
              <td class="py-3 text-gray-600">2 days ago</td>
              <td class="py-3">Office Display</td>
              <td class="py-3">Connection Lost</td>
              <td class="py-3">
                <span class="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Error</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Data Export Section -->
    <div class="bg-white p-6 rounded-2xl long-shadow">
      <div class="flex items-center mb-4">
        <i-lucide 
          name="download" 
          class="w-10 h-10 text-pastel-blue bg-pastel-blue/10 rounded-lg">
        </i-lucide>
        <h2 class="text-2xl font-bold text-gray-800">Data Export</h2>
      </div>
      
      <p class="text-gray-600 mb-4">
        Export your analytics data for further analysis or reporting.
      </p>
      
      <div class="flex flex-wrap gap-4">
        <button class="flex items-center text-lg font-bold py-3 px-6 rounded-xl text-white transition-all duration-300 transform hover:scale-[1.02] flat-btn-shadow bg-gradient-to-tr from-[#8A89F0] to-[#A2C0F5] tracking-wide">
          <i-lucide name="file-text" class="w-5 h-5 mr-2"></i-lucide>
          Export as CSV
        </button>
        <button class="flex items-center text-lg font-bold py-3 px-6 rounded-xl text-white bg-gray-500 transition-all duration-300 transform hover:scale-[1.02] flat-btn-shadow bg-gradient-to-tr from-[#AAB1BF] to-[#8B92A0] tracking-wide">
          <i-lucide name="chart-bar-big" class="w-5 h-5 mr-2"></i-lucide>
          Export as JSON
        </button>
        <a 
          href="/analytics/delete"
          class="flex items-center text-lg font-bold py-3 px-6 rounded-xl text-white transition-all duration-300 transform hover:scale-[1.02] flat-btn-shadow bg-gradient-to-tr from-[#FF988A] to-[#FFD5A2] text-gray-800">
          <i-lucide name="trash-2" class="w-5 h-5 mr-2"></i-lucide>
          Delete Data
        </a>
      </div>
    </div>
  `,
})
export default class AnalyticsPageComponent {
  showError() {
    alert('Feature coming soon!');
  }
}