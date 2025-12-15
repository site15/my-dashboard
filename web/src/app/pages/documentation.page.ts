import { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

import { ShowNavGuard } from '../guards/nav.guard';

export const routeMeta: RouteMeta = {
  canActivate: [ShowNavGuard],
};

@Component({
  selector: 'documentation-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  template: `
    <h1 class="text-4xl font-extrabold text-gray-800 mb-2">Documentation (Mock)</h1>
    <p class="text-xl text-gray-500 mb-8">Comprehensive guide to the My Dashboard project</p>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Project Overview Card -->
      <div class="bg-white p-6 rounded-2xl long-shadow">
        <div class="flex items-center mb-4">
          <i-lucide 
            name="layout-dashboard" 
            class="w-10 h-10 text-pastel-blue bg-pastel-blue/10 rounded-lg">
          </i-lucide>
          <h2 class="text-2xl font-bold text-gray-800">Project Overview</h2>
        </div>
        
        <p class="text-gray-600 mb-4">
          My Dashboard is a system for displaying information on old Android phones. Users create dashboards through a web application, add widgets, and bind phones via QR code.
        </p>
        
        <div class="space-y-3">
          <div class="flex items-start">
            <i-lucide name="check-circle" class="w-5 h-5 text-green-500 mt-0.5 mr-2"></i-lucide>
            <span class="text-gray-700">Web Application (AnalogJS + tRPC)</span>
          </div>
          <div class="flex items-start">
            <i-lucide name="check-circle" class="w-5 h-5 text-green-500 mt-0.5 mr-2"></i-lucide>
            <span class="text-gray-700">Mobile Application (Ionic + Capacitor)</span>
          </div>
          <div class="flex items-start">
            <i-lucide name="check-circle" class="w-5 h-5 text-green-500 mt-0.5 mr-2"></i-lucide>
            <span class="text-gray-700">Backend (NestJS + Prisma + PostgreSQL)</span>
          </div>
        </div>
      </div>
      
      <!-- Key Features Card -->
      <div class="bg-white p-6 rounded-2xl long-shadow">
        <div class="flex items-center mb-4">
          <i-lucide 
            name="star" 
            class="w-10 h-10 text-pastel-blue bg-pastel-blue/10 rounded-lg">
          </i-lucide>
          <h2 class="text-2xl font-bold text-gray-800">Key Features</h2>
        </div>
        
        <div class="space-y-3">
          <div class="flex items-start">
            <i-lucide name="smartphone" class="w-5 h-5 text-pastel-blue mt-0.5 mr-2"></i-lucide>
            <span class="text-gray-700">Display widgets on old Android phones</span>
          </div>
          <div class="flex items-start">
            <i-lucide name="scan" class="w-5 h-5 text-pastel-blue mt-0.5 mr-2"></i-lucide>
            <span class="text-gray-700">QR code binding for device connection</span>
          </div>
          <div class="flex items-start">
            <i-lucide name="refresh-cw" class="w-5 h-5 text-pastel-blue mt-0.5 mr-2"></i-lucide>
            <span class="text-gray-700">Real-time widget updates</span>
          </div>
          <div class="flex items-start">
            <i-lucide name="globe" class="w-5 h-5 text-pastel-blue mt-0.5 mr-2"></i-lucide>
            <span class="text-gray-700">Support for dark/light themes</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Widgets Section -->
    <div class="bg-white p-6 rounded-2xl long-shadow mb-8">
      <div class="flex items-center mb-4">
        <i-lucide 
          name="grid-3x3" 
          class="w-10 h-10 text-pastel-blue bg-pastel-blue/10 rounded-lg">
        </i-lucide>
        <h2 class="text-2xl font-bold text-gray-800">Widgets</h2>
      </div>
      
      <p class="text-gray-600 mb-4">
        Widgets are the core components of the dashboard system. Currently implemented widgets:
      </p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div class="border border-gray-200 rounded-xl p-4">
          <h3 class="text-lg font-bold text-gray-800 mb-2">Habits Tracking Widget</h3>
          <p class="text-gray-600 text-sm mb-3">
            Track daily habits and activities with progress visualization.
          </p>
          <div class="flex flex-wrap gap-2">
            <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Water</span>
            <span class="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">Food</span>
            <span class="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Medication</span>
            <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Exercise</span>
          </div>
        </div>
        
        <div class="border border-gray-200 rounded-xl p-4">
          <h3 class="text-lg font-bold text-gray-800 mb-2">Planned Widgets</h3>
          <p class="text-gray-600 text-sm mb-3">
            Additional widgets in development roadmap:
          </p>
          <div class="flex flex-wrap gap-2">
            <span class="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Clock</span>
            <span class="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Calendar</span>
            <span class="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Weather</span>
            <span class="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">More...</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Development Guide Section -->
    <div class="bg-white p-6 rounded-2xl long-shadow mb-8">
      <div class="flex items-center mb-4">
        <i-lucide 
          name="code" 
          class="w-10 h-10 text-pastel-blue bg-pastel-blue/10 rounded-lg">
        </i-lucide>
        <h2 class="text-2xl font-bold text-gray-800">Development Guide</h2>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 class="text-lg font-bold text-gray-800 mb-3">Setup</h3>
          <ol class="space-y-2 text-gray-600">
            <li class="flex items-start">
              <span class="font-bold mr-2">1.</span>
              <span>Clone repository</span>
            </li>
            <li class="flex items-start">
              <span class="font-bold mr-2">2.</span>
              <span>Install dependencies: <code class="bg-gray-100 px-1 rounded">npm install</code></span>
            </li>
            <li class="flex items-start">
              <span class="font-bold mr-2">3.</span>
              <span>Set up database with Docker</span>
            </li>
          </ol>
        </div>
        
        <div>
          <h3 class="text-lg font-bold text-gray-800 mb-3">Commands</h3>
          <ul class="space-y-2 text-gray-600">
            <li class="flex items-start">
              <i-lucide name="terminal" class="w-4 h-4 text-gray-500 mt-0.5 mr-2"></i-lucide>
              <span><code class="bg-gray-100 px-1 rounded">npm start</code> - Run dev server</span>
            </li>
            <li class="flex items-start">
              <i-lucide name="terminal" class="w-4 h-4 text-gray-500 mt-0.5 mr-2"></i-lucide>
              <span><code class="bg-gray-100 px-1 rounded">npm run build</code> - Build project</span>
            </li>
            <li class="flex items-start">
              <i-lucide name="terminal" class="w-4 h-4 text-gray-500 mt-0.5 mr-2"></i-lucide>
              <span><code class="bg-gray-100 px-1 rounded">ionic serve</code> - Run mobile app</span>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 class="text-lg font-bold text-gray-800 mb-3">Tech Stack</h3>
          <ul class="space-y-2 text-gray-600">
            <li class="flex items-center">
              <i-lucide name="box" class="w-4 h-4 text-pastel-blue mr-2"></i-lucide>
              <span>AnalogJS (Angular)</span>
            </li>
            <li class="flex items-center">
              <i-lucide name="database" class="w-4 h-4 text-pastel-blue mr-2"></i-lucide>
              <span>Prisma ORM + PostgreSQL</span>
            </li>
            <li class="flex items-center">
              <i-lucide name="smartphone" class="w-4 h-4 text-pastel-blue mr-2"></i-lucide>
              <span>Ionic + Capacitor</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    
    <!-- Resources Section -->
    <div class="bg-white p-6 rounded-2xl long-shadow">
      <div class="flex items-center mb-4">
        <i-lucide 
          name="book-open" 
          class="w-10 h-10 text-pastel-blue bg-pastel-blue/10 rounded-lg">
        </i-lucide>
        <h2 class="text-2xl font-bold text-gray-800">Resources</h2>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a 
          href="https://github.com/site15/my-dashboard" 
          target="_blank"
          class="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
          <i-lucide name="github" class="w-6 h-6 text-gray-700 mr-3"></i-lucide>
          <div>
            <h3 class="font-bold text-gray-800">GitHub Repository</h3>
            <p class="text-gray-600 text-sm">Source code and issues</p>
          </div>
        </a>
        
        <a 
          href="https://t.me/site15_community" 
          target="_blank"
          class="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
          <i-lucide name="message-circle" class="w-6 h-6 text-gray-700 mr-3"></i-lucide>
          <div>
            <h3 class="font-bold text-gray-800">Developer Community</h3>
            <p class="text-gray-600 text-sm">Telegram chat for support</p>
          </div>
        </a>
      </div>
    </div>
  `,
})
export default class DocumentationPageComponent {}