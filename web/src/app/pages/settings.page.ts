import { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

import { ShowNavGuard } from '../guards/nav.guard';

export const routeMeta: RouteMeta = {
  canActivate: [ShowNavGuard],
};

@Component({
  selector: 'settings-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule, ReactiveFormsModule],
  template: `
    <h1 class="text-4xl font-extrabold text-gray-800 mb-2">Settings (Mock)</h1>
    <p class="text-xl text-gray-500 mb-8">
      Configure your dashboard system preferences
    </p>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Account Settings Card -->
      <div class="bg-white p-6 rounded-2xl long-shadow">
        <div class="flex items-center mb-4">
          <i-lucide
            name="user"
            class="w-10 h-10 text-pastel-blue bg-pastel-blue/10 rounded-lg"
          >
          </i-lucide>
          <h2 class="text-2xl font-bold text-gray-800">Account Settings</h2>
        </div>

        <form class="space-y-4">
          <div class="flex flex-col">
            <label class="text-gray-700 font-medium mb-2">Email Address</label>
            <input
              type="email"
              class="flat-input"
              placeholder="your.email@example.com"
              value="user@example.com"
            />
          </div>

          <div class="flex flex-col">
            <label class="text-gray-700 font-medium mb-2"
              >Notification Preferences</label
            >
            <div class="space-y-2">
              <div class="flex items-center">
                <input type="checkbox" class="flat-checkbox mr-3" checked />
                <label class="text-gray-600">Email notifications</label>
              </div>
              <div class="flex items-center">
                <input type="checkbox" class="flat-checkbox mr-3" />
                <label class="text-gray-600">SMS alerts</label>
              </div>
              <div class="flex items-center">
                <input type="checkbox" class="flat-checkbox mr-3" checked />
                <label class="text-gray-600">In-app notifications</label>
              </div>
            </div>
          </div>

          <div class="pt-4">
            <button
              type="button"
              class="text-lg font-bold py-3 px-6 rounded-xl text-white bg-pastel-blue transition-all duration-300 transform hover:scale-[1.02] flat-btn-shadow bg-gradient-to-tr from-[#8A89F0] to-[#A2C0F5] tracking-wide"
            >
              Update Account
            </button>
          </div>
        </form>
      </div>

      <!-- System Preferences Card -->
      <div class="bg-white p-6 rounded-2xl long-shadow">
        <div class="flex items-center mb-4">
          <i-lucide
            name="settings"
            class="w-10 h-10 text-pastel-blue bg-pastel-blue/10 rounded-lg"
          >
          </i-lucide>
          <h2 class="text-2xl font-bold text-gray-800">System Preferences</h2>
        </div>

        <form class="space-y-4">
          <div class="flex flex-col">
            <label class="text-gray-700 font-medium mb-2">Default Theme</label>
            <select class="flat-input">
              <option>Light Theme</option>
              <option>Dark Theme</option>
              <option>Auto (System)</option>
            </select>
          </div>

          <div class="flex flex-col">
            <label class="text-gray-700 font-medium mb-2"
              >Data Sync Frequency</label
            >
            <select class="flat-input">
              <option>Real-time</option>
              <option>Every 5 minutes</option>
              <option>Every 15 minutes</option>
              <option>Every hour</option>
            </select>
          </div>

          <div class="flex flex-col">
            <label class="text-gray-700 font-medium mb-2"
              >Privacy Settings</label
            >
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label class="text-gray-600">Share usage analytics</label>
                <label class="flat-switch">
                  <input type="checkbox" checked />
                  <span class="flat-switch-slider"></span>
                </label>
              </div>
              <div class="flex items-center justify-between">
                <label class="text-gray-600">Enable crash reporting</label>
                <label class="flat-switch">
                  <input type="checkbox" checked />
                  <span class="flat-switch-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div class="pt-4">
            <button
              type="button"
              class="text-lg font-bold py-3 px-6 rounded-xl text-white bg-pastel-blue transition-all duration-300 transform hover:scale-[1.02] flat-btn-shadow bg-gradient-to-tr from-[#8A89F0] to-[#A2C0F5] tracking-wide"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Advanced Settings Section -->
    <div class="bg-white p-6 rounded-2xl long-shadow mt-8">
      <div class="flex items-center mb-4">
        <i-lucide
          name="code"
          class="w-10 h-10 text-pastel-blue bg-pastel-blue/10 rounded-lg"
        >
        </i-lucide>
        <h2 class="text-2xl font-bold text-gray-800">Advanced Settings</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-xl font-bold text-gray-800 mb-3">
            API Configuration
          </h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-gray-600">API Endpoint</span>
              <span class="font-mono text-sm bg-gray-100 px-2 py-1 rounded"
                >/api/v1</span
              >
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Rate Limiting</span>
              <span class="font-mono text-sm bg-gray-100 px-2 py-1 rounded"
                >1000 req/hr</span
              >
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Authentication</span>
              <span class="font-mono text-sm bg-gray-100 px-2 py-1 rounded"
                >JWT</span
              >
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-xl font-bold text-gray-800 mb-3">Security</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Two-Factor Auth</span>
              <span
                class="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800"
                >Enabled</span
              >
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Last Password Change</span>
              <span class="text-sm text-gray-600">15 days ago</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Active Sessions</span>
              <span class="font-mono text-sm bg-gray-100 px-2 py-1 rounded"
                >3</span
              >
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap gap-4 mt-6">
        <button
          type="button"
          class="flex items-center text-lg font-bold py-3 px-6 rounded-xl text-white bg-gray-500 transition-all duration-300 transform hover:scale-[1.02] flat-btn-shadow bg-gradient-to-tr from-[#9CA3AF] to-[#6B7280] tracking-wide"
        >
          <i-lucide name="rotate-ccw" class="w-5 h-5 mr-2"></i-lucide>
          Reset to Defaults
        </button>
        <button
          type="button"
          class="flex items-center text-lg font-bold py-3 px-6 rounded-xl text-white transition-all duration-300 transform hover:scale-[1.02] flat-btn-shadow bg-gradient-to-tr from-[#FF988A] to-[#FFD5A2] text-gray-800"
        >
          <i-lucide name="trash-2" class="w-5 h-5 mr-2"></i-lucide>
          Clear Cache
        </button>
        <a
          href="/settings/delete"
          class="flex items-center text-lg font-bold py-3 px-6 rounded-xl text-white transition-all duration-300 transform hover:scale-[1.02] flat-btn-shadow bg-gradient-to-tr from-[#FF988A] to-[#FFD5A2] text-gray-800"
        >
          <i-lucide name="user-x" class="w-5 h-5 mr-2"></i-lucide>
          Delete Account
        </a>
      </div>
    </div>
  `,
})
export default class SettingsPageComponent {
  form = new UntypedFormGroup({});

  showError() {
    alert('Feature coming soon!');
  }
}
