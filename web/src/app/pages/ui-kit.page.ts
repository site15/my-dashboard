import { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

export const routeMeta: RouteMeta = {
  title: 'UI Kit',
};

@Component({
  selector: 'app-ui-kit',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-12">
      <div class="max-w-6xl mx-auto px-4">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">UI Kit</h1>
        <p class="text-xl text-gray-600 mb-8">
          Collection of all UI components and form controls
        </p>

        <!-- Navigation -->
        <nav class="mb-12 flex flex-wrap gap-4">
          <a
            routerLink="."
            fragment="typography"
            class="px-4 py-2 bg-white rounded-lg long-shadow hover:bg-gray-100 transition-colors"
          >
            Typography
          </a>
          <a
            routerLink="."
            fragment="colors"
            class="px-4 py-2 bg-white rounded-lg long-shadow hover:bg-gray-100 transition-colors"
          >
            Colors
          </a>
          <a
            routerLink="."
            fragment="buttons"
            class="px-4 py-2 bg-white rounded-lg long-shadow hover:bg-gray-100 transition-colors"
          >
            Buttons
          </a>
          <a
            routerLink="."
            fragment="form-controls"
            class="px-4 py-2 bg-white rounded-lg long-shadow hover:bg-gray-100 transition-colors"
          >
            Form Controls
          </a>
          <a
            routerLink="."
            fragment="components"
            class="px-4 py-2 bg-white rounded-lg long-shadow hover:bg-gray-100 transition-colors"
          >
            Components
          </a>
        </nav>

        <!-- Typography -->
        <section id="typography" class="mb-16 scroll-mt-24">
          <h2
            class="text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-gray-200"
          >
            Typography
          </h2>

          <div class="bg-white rounded-2xl long-shadow p-8">
            <h1 class="text-4xl font-bold mb-4">Heading 1</h1>
            <h2 class="text-3xl font-semibold mb-4">Heading 2</h2>
            <h3 class="text-2xl font-medium mb-4">Heading 3</h3>
            <h4 class="text-xl font-medium mb-4">Heading 4</h4>
            <p class="text-lg mb-4">
              Large paragraph text with regular weight.
            </p>
            <p class="mb-4">Standard paragraph text with regular weight.</p>
            <p class="text-sm mb-4">
              Small paragraph text with regular weight.
            </p>
            <p class="text-xs">
              Extra small paragraph text with regular weight.
            </p>
          </div>
        </section>

        <!-- Colors -->
        <section id="colors" class="mb-16 scroll-mt-24">
          <h2
            class="text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-gray-200"
          >
            Colors
          </h2>

          <div class="bg-white rounded-2xl long-shadow p-8">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div class="text-center">
                <div class="w-full h-24 rounded-lg mb-2 bg-[#8A89F0]"></div>
                <p class="font-medium">#8A89F0</p>
                <p class="text-sm text-gray-600">Primary</p>
              </div>
              <div class="text-center">
                <div class="w-full h-24 rounded-lg mb-2 bg-[#6d6cb5]"></div>
                <p class="font-medium">#6d6cb5</p>
                <p class="text-sm text-gray-600">Secondary</p>
              </div>
              <div class="text-center">
                <div class="w-full h-24 rounded-lg mb-2 bg-gray-200"></div>
                <p class="font-medium">gray-200</p>
                <p class="text-sm text-gray-600">Light</p>
              </div>
              <div class="text-center">
                <div class="w-full h-24 rounded-lg mb-2 bg-gray-700"></div>
                <p class="font-medium">gray-700</p>
                <p class="text-sm text-gray-600">Dark</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Buttons -->
        <section id="buttons" class="mb-16 scroll-mt-24">
          <h2
            class="text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-gray-200"
          >
            Buttons
          </h2>

          <div class="bg-white rounded-2xl long-shadow p-8">
            <div class="grid grid-cols-1 gap-8">
              <!-- Primary Buttons -->
              <div>
                <h3 class="text-xl font-semibold mb-4">Primary Buttons</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 class="font-medium mb-2">Standard Primary</h4>
                    <button
                      class="w-full text-xl font-bold py-4 rounded-2xl text-white bg-pastel-blue transition-all duration-300 transform hover:scale-[1.02] flat-btn-shadow bg-gradient-to-tr from-[#8A89F0] to-[#A2C0F5] tracking-wide"
                    >
                      Sign In
                    </button>
                    <p class="text-sm text-gray-600 mt-2">
                      Used in login and dashboard creation
                    </p>
                  </div>

                  <div>
                    <h4 class="font-medium mb-2">Primary with Icon</h4>
                    <button
                      class="w-full flex items-center justify-center text-xl font-bold py-4 rounded-2xl text-white bg-pastel-blue transition-all duration-300 transform hover:scale-[1.02] flat-btn-shadow bg-gradient-to-tr from-[#8A89F0] to-[#A2C0F5] tracking-wide"
                    >
                      <i-lucide name="plus" class="w-5 h-5 mr-2"></i-lucide>
                      Create New Dashboard
                    </button>
                    <p class="text-sm text-gray-600 mt-2">
                      Used for primary actions with icons
                    </p>
                  </div>
                </div>
              </div>

              <!-- Secondary Buttons -->
              <div>
                <h3 class="text-xl font-semibold mb-4">Secondary Buttons</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 class="font-medium mb-2">Text Link Buttons</h4>
                    <div class="flex flex-wrap gap-4">
                      <button
                        class="text-pastel-blue font-semibold hover:text-pastel-blue/80 transition-colors"
                      >
                        Login via Telegram
                      </button>
                      <button
                        class="text-gray-500 font-medium hover:text-gray-800 transition-colors"
                      >
                        Continue as Guest
                      </button>
                    </div>
                    <p class="text-sm text-gray-600 mt-2">
                      Used for alternative actions
                    </p>
                  </div>

                  <div>
                    <h4 class="font-medium mb-2">Flat Secondary</h4>
                    <button
                      class="w-full bg-white text-[#8A89F0] border-2 border-[#8A89F0] font-medium py-3 px-6 rounded-xl hover:bg-[#8A89F0] hover:text-white transition-colors"
                    >
                      Secondary Button
                    </button>
                    <p class="text-sm text-gray-600 mt-2">
                      Basic secondary button style
                    </p>
                  </div>
                </div>
              </div>

              <!-- Utility Buttons -->
              <div>
                <h3 class="text-xl font-semibold mb-4">Utility Buttons</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 class="font-medium mb-2">Icon Button</h4>
                    <button
                      class="text-pastel-blue hover:text-pastel-blue/80 p-2 rounded-full transition-colors bg-pastel-blue/10 dark:bg-pastel-blue/30"
                    >
                      <i-lucide name="calendar" class="w-6 h-6"></i-lucide>
                    </button>
                    <p class="text-sm text-gray-600 mt-2">
                      Used for actions like opening modals
                    </p>
                  </div>

                  <div>
                    <h4 class="font-medium mb-2">QR Button</h4>
                    <button
                      class="flex items-center text-lg font-bold py-3 px-6 rounded-xl text-white transition-all duration-300 transform hover:scale-[1.02] flat-btn-shadow mb-8 bg-gradient-to-tr from-[#FF988A] to-[#FFD5A2] text-gray-800"
                    >
                      <i-lucide name="qr-code" class="w-5 h-5 mr-2"></i-lucide>
                      Show QR
                    </button>
                    <p class="text-sm text-gray-600 mt-2">
                      Used for displaying QR codes
                    </p>
                  </div>

                  <div>
                    <h4 class="font-medium mb-2">Add Widget Button</h4>
                    <button
                      class="text-gray-500 hover:text-pastel-blue font-bold flex items-center border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-pastel-blue/50 hover:bg-pastel-blue/5 dark:border-gray-700 dark:hover:bg-pastel-blue/10"
                    >
                      <i-lucide name="plus" class="w-5 h-5 mr-2"></i-lucide>
                      Add Widget
                    </button>
                    <p class="text-sm text-gray-600 mt-2">
                      Used for adding new items
                    </p>
                  </div>
                </div>
              </div>

              <!-- Disabled States -->
              <div>
                <h3 class="text-xl font-semibold mb-4">Disabled States</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 class="font-medium mb-2">Disabled Primary</h4>
                    <button
                      class="w-full text-xl font-bold py-4 rounded-2xl text-white bg-pastel-blue transition-all duration-300 flat-btn-shadow bg-gradient-to-tr from-[#8A89F0] to-[#A2C0F5] tracking-wide opacity-50 cursor-not-allowed"
                      disabled
                    >
                      Disabled Button
                    </button>
                  </div>

                  <div>
                    <h4 class="font-medium mb-2">Disabled Secondary</h4>
                    <button
                      class="w-full bg-white text-[#8A89F0] border-2 border-[#8A89F0] font-medium py-3 px-6 rounded-xl opacity-50 cursor-not-allowed"
                      disabled
                    >
                      Disabled Button
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Form Controls -->
        <section id="form-controls" class="mb-16 scroll-mt-24">
          <h2
            class="text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-gray-200"
          >
            Form Controls
          </h2>

          <div class="bg-white rounded-2xl long-shadow p-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Text Inputs -->
              <div>
                <h3 class="text-xl font-semibold mb-4">Text Inputs</h3>

                <div class="space-y-6">
                  <div>
                    <label class="block text-lg font-medium text-gray-700 mb-2"
                      >Text Input</label
                    >
                    <input
                      type="text"
                      class="flat-input"
                      placeholder="Enter text"
                    />
                  </div>

                  <div>
                    <label class="block text-lg font-medium text-gray-700 mb-2"
                      >Email Input</label
                    >
                    <input
                      type="email"
                      class="flat-input"
                      placeholder="Enter email"
                    />
                  </div>

                  <div>
                    <label class="block text-lg font-medium text-gray-700 mb-2"
                      >Password Input</label
                    >
                    <input
                      type="password"
                      class="flat-input"
                      placeholder="Enter password"
                    />
                  </div>

                  <div>
                    <label class="block text-lg font-medium text-gray-700 mb-2"
                      >Textarea</label
                    >
                    <textarea
                      class="flat-input"
                      rows="4"
                      placeholder="Enter message"
                    ></textarea>
                  </div>
                </div>
              </div>

              <!-- Checkboxes & Radios -->
              <div>
                <h3 class="text-xl font-semibold mb-4">Selection Controls</h3>

                <div class="space-y-6">
                  <div>
                    <label class="block text-lg font-medium text-gray-700 mb-3"
                      >Checkboxes</label
                    >
                    <div class="space-y-3">
                      <div class="flex items-center">
                        <input
                          type="checkbox"
                          id="checkbox1"
                          class="flat-checkbox"
                        />
                        <label for="checkbox1" class="ml-2 text-gray-700"
                          >Unchecked checkbox</label
                        >
                      </div>

                      <div class="flex items-center">
                        <input
                          type="checkbox"
                          id="checkbox2"
                          class="flat-checkbox"
                          checked
                        />
                        <label for="checkbox2" class="ml-2 text-gray-700"
                          >Checked checkbox</label
                        >
                      </div>

                      <div class="flex items-center">
                        <input
                          type="checkbox"
                          id="checkbox3"
                          class="flat-checkbox"
                          disabled
                        />
                        <label for="checkbox3" class="ml-2 text-gray-700"
                          >Disabled checkbox</label
                        >
                      </div>
                    </div>
                  </div>

                  <div>
                    <label class="block text-lg font-medium text-gray-700 mb-3"
                      >Radio Buttons</label
                    >
                    <div class="space-y-3">
                      <div class="flex items-center">
                        <input
                          type="radio"
                          id="radio1"
                          name="radio-group"
                          class="flat-checkbox"
                        />
                        <label for="radio1" class="ml-2 text-gray-700"
                          >Unchecked radio</label
                        >
                      </div>

                      <div class="flex items-center">
                        <input
                          type="radio"
                          id="radio2"
                          name="radio-group"
                          class="flat-checkbox"
                          checked
                        />
                        <label for="radio2" class="ml-2 text-gray-700"
                          >Checked radio</label
                        >
                      </div>

                      <div class="flex items-center">
                        <input
                          type="radio"
                          id="radio3"
                          name="radio-group"
                          class="flat-checkbox"
                          disabled
                        />
                        <label for="radio3" class="ml-2 text-gray-700"
                          >Disabled radio</label
                        >
                      </div>
                    </div>
                  </div>

                  <div>
                    <label class="block text-lg font-medium text-gray-700 mb-2"
                      >Select Dropdown</label
                    >
                    <select class="flat-input">
                      <option>Select an option</option>
                      <option>Option 1</option>
                      <option>Option 2</option>
                      <option>Option 3</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Components -->
        <section id="components" class="mb-16 scroll-mt-24">
          <h2
            class="text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-gray-200"
          >
            Components
          </h2>

          <div class="bg-white rounded-2xl long-shadow p-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 class="text-xl font-semibold mb-4">Switch</h3>
                <div class="flex items-center">
                  <label class="flat-switch">
                    <input type="checkbox" />
                    <span class="flat-switch-slider"></span>
                  </label>
                  <span class="ml-3 text-gray-700">Toggle switch</span>
                </div>
              </div>

              <div>
                <h3 class="text-xl font-semibold mb-4">Loading Spinner</h3>
                <div class="flex items-center">
                  <div class="loading-spinner"></div>
                  <span class="ml-3 text-gray-700">Loading...</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
})
export default class UiKitPageComponent {}
