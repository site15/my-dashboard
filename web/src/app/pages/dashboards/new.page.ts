import { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import { LucideAngularModule } from 'lucide-angular';
import { catchError, EMPTY, first, tap } from 'rxjs';

import { CreateDashboardType } from '../../../server/types/DashboardSchema';
import { ShowNavGuard } from '../../guards/nav.guard';
import {
  DASHBOARD_FORMLY_FIELDS,
  DashboardsService,
} from '../../services/dashboards.service';

export const routeMeta: RouteMeta = {
  canActivate: [ShowNavGuard],
};

@Component({
  selector: 'dashboards-new-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormlyBootstrapModule,
    ReactiveFormsModule,
    FormlyForm,
    LucideAngularModule,
  ],
  template: `
    <h1 class="text-4xl font-extrabold text-gray-800 mb-2">
      <a href="/dashboards">Dashboards</a>: New dashboard
    </h1>
    <p class="text-xl text-gray-500 mb-8">Update settings and widgets.</p>

    <!-- Control Panel (Redacted for brevity) -->
    <div class="bg-white p-6 rounded-2xl long-shadow mb-8 space-y-4">
      <div
        class="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <form [formGroup]="form" (ngSubmit)="onSubmit(model)">
          <formly-form
            [form]="form"
            [fields]="fields"
            [model]="model"
          ></formly-form>
          <div class="flex gap-4">
            <button
              class="flex items-center text-lg font-bold py-3 px-6 rounded-xl text-white transition-all duration-300 transform hover:scale-[1.02] flat-btn-shadow  mb-8 
                        bg-gradient-to-tr from-[#FF988A] to-[#FFD5A2] text-gray-800"
              onclick="showView('qr-view')"
            >
              <i data-lucide="qr-code" class="w-5 h-5 mr-2"></i>
              Показать QR
            </button>

            <button
              class="flex items-center text-lg font-bold py-3 px-6 rounded-xl text-white bg-pastel-blue transition-all duration-300 transform hover:scale-[1.02] flat-btn-shadow mb-8 
                bg-gradient-to-tr from-[#8A89F0] to-[#A2C0F5] tracking-wide flex items-center justify-center"
              type="submit"
            >
              <i-lucide name="plus" class="w-5 h-5 mr-2"></i-lucide>
              Create
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Сетка виджетов -->
    <h2 class="text-3xl font-bold text-gray-800 mb-6">Сетка Виджетов</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Виджет 1: Мировое Время (АНАЛОГОВЫЕ И ЦИФРОВЫЕ ЧАСЫ) -->
      <!-- Область для ротации и клика по аналоговому циферблату -->
      <div
        class="bg-white p-6 rounded-2xl long-shadow transition-all duration-300 relative overflow-hidden h-48 flex flex-col justify-between border-l-4 border-pastel-green"
      >
        <!-- Главные часы (Аналоговые + Цифровые + Имя). Клик по цифровому блоку - ротация. Клик по canvas - модалка -->
        <div class="flex items-center justify-center flex-grow">
          <!-- Canvas для аналоговых часов - ОТКРЫТИЕ МОДАЛКИ -->
          <canvas
            id="main-analog-clock"
            class="w-24 h-24 mr-6 cursor-pointer"
            onclick="event.stopPropagation(); showModal('clocks-modal');"
          ></canvas>

          <!-- Цифровое время и Имя - СМЕНА ГЛАВНЫХ ЧАСОВ -->
          <div
            class="flex flex-col items-center cursor-pointer"
            onclick="rotateClocks(event);"
          >
            <!-- Цифровые часы (уменьшенный шрифт, без секунд) -->
            <p
              id="main-clock-time"
              class="text-4xl font-extrabold transition-colors duration-300 tracking-tight text-gray-800 dark:text-gray-100"
            >
              --:--
            </p>
            <!-- Имя часов (под цифровым временем) -->
            <p
              id="main-clock-name"
              class="text-md font-medium mt-1 text-center text-gray-600 dark:text-gray-300"
            ></p>
          </div>
        </div>

        <!-- Маленькие часы (Горизонтальный стек) -->
        <div
          class="flex justify-around items-center w-full pt-2 mt-4 border-t border-gray-100 dark:border-gray-700"
        >
          <div class="text-center w-1/2">
            <p
              id="small-clock-time-1"
              class="text-xl font-bold text-gray-800 dark:text-gray-200"
            >
              --:--
            </p>
            <p id="small-clock-name-1" class="text-xs text-gray-500"></p>
          </div>
          <div class="text-center w-1/2">
            <p
              id="small-clock-time-2"
              class="text-xl font-bold text-gray-800 dark:text-gray-200"
            >
              --:--
            </p>
            <p id="small-clock-name-2" class="text-xs text-gray-500"></p>
          </div>
        </div>
      </div>
      <!-- END Виджет 1 -->

      <!-- Виджет 2: Календарь / Прогресс Месяца -->
      <div
        class="bg-white p-6 rounded-2xl long-shadow transition-all duration-300 relative overflow-hidden h-40 flex flex-col justify-between border-l-4 border-pastel-blue"
      >
        <div class="flex justify-between items-start">
          <div class="flex flex-col">
            <p class="text-sm text-gray-500 font-medium">Текущая Дата</p>
            <p
              id="monthly-progress-date"
              class="text-2xl font-extrabold text-gray-800"
            ></p>
          </div>
          <button
            class="text-pastel-blue hover:text-pastel-blue/80 p-2 rounded-full transition-colors bg-pastel-blue/10 dark:bg-pastel-blue/30"
            onclick="showModal('calendar-modal')"
          >
            <i data-lucide="calendar" class="w-6 h-6"></i>
          </button>
        </div>

        <div class="mt-4">
          <p
            id="monthly-progress-text"
            class="text-sm text-gray-600 mb-1 font-medium"
          ></p>
          <div
            class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden"
          >
            <div
              id="monthly-progress-value"
              class="h-2.5 rounded-full bg-pastel-blue transition-all duration-500"
              style="width: 0%"
            ></div>
          </div>
        </div>
      </div>

      <!-- Виджет 3 (Кнопка редактирования) -->
      <div
        class="bg-white p-6 rounded-2xl long-shadow group transition-all duration-300 relative overflow-hidden h-40 flex flex-col justify-between"
      >
        <button
          class="absolute top-2 right-2 text-gray-400 hover:text-pastel-blue opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-white/70 backdrop-blur-sm dark:bg-[#1e1e1e]/70"
          onclick="showView('widget-editor')"
        >
          <i data-lucide="pencil" class="w-5 h-5"></i>
        </button>
        <div class="flex items-center">
          <i
            data-lucide="trending-up"
            class="w-8 h-8 text-pastel-green mr-3"
          ></i>
          <p class="text-lg font-medium text-gray-600">Общая Выручка</p>
        </div>
        <p class="text-4xl font-extrabold text-gray-800 mt-2">$245,300</p>
      </div>

      <!-- Виджет 4 -->
      <div
        class="bg-white p-6 rounded-2xl long-shadow group transition-all duration-300 relative overflow-hidden h-40 flex flex-col justify-between"
      >
        <button
          class="absolute top-2 right-2 text-gray-400 hover:text-pastel-blue opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-white/70 backdrop-blur-sm dark:bg-[#1e1e1e]/70"
          onclick="showView('widget-editor')"
        >
          <i data-lucide="pencil" class="w-5 h-5"></i>
        </button>
        <div class="flex items-center">
          <i data-lucide="users" class="w-8 h-8 text-pastel-blue mr-3"></i>
          <p class="text-lg font-medium text-gray-600">Новые Клиенты</p>
        </div>
        <p class="text-4xl font-extrabold text-gray-800 mt-2">
          1,504 <span class="text-xl text-pastel-green ml-2">+14%</span>
        </p>
      </div>

      <!-- Виджет 5 -->
      <div
        class="bg-white p-6 rounded-2xl long-shadow group transition-all duration-300 relative overflow-hidden h-40 flex flex-col justify-between"
      >
        <button
          class="absolute top-2 right-2 text-gray-400 hover:text-pastel-blue opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-white/70 backdrop-blur-sm dark:bg-[#1e1e1e]/70"
          onclick="showView('widget-editor')"
        >
          <i data-lucide="target" class="w-5 h-5"></i>
        </button>
        <div class="flex items-center">
          <i data-lucide="target" class="w-8 h-8 text-pastel-pink mr-3"></i>
          <p class="text-lg font-medium text-gray-600">Конверсия</p>
        </div>
        <p class="text-4xl font-extrabold text-gray-800 mt-2">4.7%</p>
      </div>

      <!-- Виджет 6: Отслеживание привычек -->
      <div
        class="bg-white p-6 rounded-2xl long-shadow group transition-all duration-300 relative overflow-hidden h-40 flex flex-col justify-between border-l-4 border-pastel-green"
        onclick="showModal('water-food-modal')"
      >
        <button
          class="absolute top-2 right-2 text-gray-400 hover:text-pastel-blue opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-white/70 backdrop-blur-sm dark:bg-[#1e1e1e]/70"
          onclick="showView('widget-editor'); event.stopPropagation();"
        >
          <i data-lucide="pencil" class="w-5 h-5"></i>
        </button>
        <div class="flex items-center">
          <i data-lucide="activity" class="w-8 h-8 text-pastel-green mr-3"></i>
          <p class="text-lg font-medium text-gray-600">Привычки</p>
        </div>
        <div id="tracking-widget-content">
          <!-- Dynamic content will be inserted here by JavaScript -->
        </div>
      </div>

      <!-- Кнопка "Добавить виджет" -->
      <div
        class="border-4 border-dashed border-gray-200 rounded-2xl transition-all duration-300 hover:border-pastel-blue/50 hover:bg-pastel-blue/5 cursor-pointer h-40 flex items-center justify-center dark:border-gray-700 dark:hover:bg-pastel-blue/10"
      >
        <button
          class="text-gray-500 hover:text-pastel-blue font-bold text-lg flex items-center"
          onclick="showView('widget-editor')"
        >
          <i data-lucide="plus" class="w-6 h-6 mr-2"></i>
          Добавить Виджет
        </button>
      </div>
    </div>
  `,
})
export default class DashboardsNewPageComponent {
  private readonly router = inject(Router);
  private readonly dashboardsService = inject(DashboardsService);

  form = new UntypedFormGroup({});
  model: CreateDashboardType = {
    name: '',
    isBlackTheme: false,
    isActive: true,
  };
  fields: FormlyFieldConfig[] = DASHBOARD_FORMLY_FIELDS;

  onSubmit(model: CreateDashboardType) {
    this.dashboardsService
      .create(model)
      .pipe(
        first(), // Take only the first emission and complete
        tap((dashboard: { id: string }) => {
          if (dashboard && dashboard.id) {
            this.router.navigate([`/dashboards/${dashboard.id}`]);
          }
        }),
        catchError(error => {
          console.error('Dashboard creation failed:', error);
          return EMPTY;
        })
      )
      .subscribe();
  }
}
