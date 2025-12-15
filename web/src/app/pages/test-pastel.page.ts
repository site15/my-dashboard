import { Component } from '@angular/core';

@Component({
  selector: 'app-test-pastel',
  standalone: true,
  template: `
    <div class="p-8">
      <h1 class="text-2xl font-bold mb-4">Pastel Blue Test</h1>
      
      <div class="space-y-4">
        <div class="p-4 bg-pastel-blue text-white rounded-lg">
          Background pastel blue
        </div>
        
        <div class="p-4 text-pastel-blue border border-pastel-blue rounded-lg">
          Text and border pastel blue
        </div>
        
        <div class="p-4 bg-pastel-blue/20 text-pastel-blue rounded-lg">
          Background pastel blue 20% opacity
        </div>
        
        <button class="px-4 py-2 bg-pastel-blue text-white rounded-lg hover:bg-pastel-blue/80 transition-colors">
          Button with pastel blue
        </button>
      </div>
    </div>
  `,
})
export default class TestPastelPageComponent {}