import { RouteMeta } from '@analogjs/router';
import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import { LucideAngularModule } from 'lucide-angular';
import { first, forkJoin, map, of, shareReplay, switchMap, tap } from 'rxjs';

import { UpdateDashboardType } from '../../../../server/types/DashboardSchema';
import { ShowNavGuard } from '../../../guards/nav.guard';
import {
  DASHBOARD_FORMLY_FIELDS,
  DashboardsService,
} from '../../../services/dashboards.service';
import { WidgetsService } from '../../../services/widgets.service';

export const routeMeta: RouteMeta = {
  canActivate: [ShowNavGuard],
};

@Component({
  selector: 'dashboards-edit-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormlyBootstrapModule,
    AsyncPipe,
    ReactiveFormsModule,
    FormlyForm,
    LucideAngularModule,
    TitleCasePipe,
  ],
  template: `
    @if (dashboardAndWidgets$ | async; as dashboardAndWidgets) {
      <h1 class="text-4xl font-extrabold text-gray-800 mb-2">
        <a href="/dashboards"
          >Edit Dashboard "{{ dashboardAndWidgets.dashboard.name }}"</a
        >
      </h1>
      <p class="text-xl text-gray-500 mb-8">
        <a
          href="/dashboards"
          class="text-gray-500 hover:text-pastel-blue transition-colors mb-10 mt-2 flex items-center"
        >
          <i-lucide name="arrow-left" class="w-6 h-6 mr-0 lg:mr-2"></i-lucide>
          <span class="hidden lg:inline text-lg font-medium">Dashboards</span>
        </a>
        Update settings and widgets.
      </p>

      <!-- Control Panel -->
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
              <a
                href="/dashboards/{{ dashboardAndWidgets.dashboard.id }}/delete"
                class="flex items-center text-lg font-bold py-3 px-6 rounded-xl text-white transition-all duration-300 transform hover:scale-[1.02] flat-btn-shadow mb-8 
                  bg-gradient-to-tr from-[#FF988A] to-[#FFD5A2] text-gray-800 cursor-pointer"
              >
                <i-lucide name="trash-2" class="w-5 h-5 mr-2"></i-lucide>
                Delete Dashboard
              </a>

              <a
                href="/dashboards/{{
                  dashboardAndWidgets.dashboard.id
                }}/link-device"
                class="flex items-center text-lg font-bold py-3 px-6 rounded-xl text-white bg-pastel-blue transition-all duration-300 transform hover:scale-[1.02] flat-btn-shadow mb-8 
                  bg-gradient-to-tr from-[#8A89F0] to-[#A2C0F5] tracking-wide cursor-pointer"
              >
                <i-lucide name="smartphone" class="w-5 h-5 mr-2"></i-lucide>
                Link Device
              </a>

              <button
                type="submit"
                class="flex items-center text-lg font-bold py-3 px-6 rounded-xl text-white bg-pastel-blue transition-all duration-300 transform hover:scale-[1.02] flat-btn-shadow mb-8 
                  bg-gradient-to-tr from-[#8A89F0] to-[#A2C0F5] tracking-wide flex items-center justify-center cursor-pointer"
              >
                <i-lucide name="save" class="w-5 h-5 mr-2"></i-lucide>
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Widget Grid -->
      <h2 class="text-3xl font-bold text-gray-800 mb-6">Widget Grid</h2>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-6 gap-6"
      >
        @for (
          widget of dashboardAndWidgets.widgets;
          track widget.id;
          let last = $last
        ) {
          <a
            href="/dashboards/{{ dashboardAndWidgets.dashboard.id }}/widgets/{{
              widget.id
            }}"
            class="bg-white p-6 rounded-2xl long-shadow transition-all duration-300 hover:scale-[1.01] cursor-pointer"
          >
            <div class="flex justify-between items-start mb-4">
              <i-lucide
                [name]="
                  widget.type === 'clock'
                    ? 'clock'
                    : widget.type === 'calendar'
                      ? 'calendar'
                      : 'activity'
                "
                class="w-8 h-8 text-pastel-blue mr-3"
              ></i-lucide>
              <p class="text-lg font-medium text-gray-600">
                {{ widget.type | titlecase }} Widget
              </p>
            </div>

            <div
              class="flex justify-between items-center text-sm font-medium text-gray-600 pt-2 border-t border-gray-100"
            >
              <span>ID: {{ widget.id.substring(0, 8) }}...</span>
              <span
                class="flex items-center text-pastel-blue hover:text-pastel-blue/80"
              >
                Open
                <i-lucide name="arrow-right" class="w-4 h-4 ml-1"></i-lucide>
              </span>
            </div>
          </a>

          @if (last) {
            <!-- "Add Widget" Button for when there are widgets -->
            <div
              class="border-4 border-dashed border-gray-200 rounded-2xl transition-all duration-300 hover:border-pastel-blue/50 hover:bg-pastel-blue/5 cursor-pointer h-40 flex items-center justify-center dark:border-gray-700 dark:hover:bg-pastel-blue/10"
            >
              <div class="text-center">
                <p
                  class="text-gray-500 hover:text-pastel-blue font-bold text-lg flex items-center justify-center"
                >
                  <i-lucide name="plus" class="w-6 h-6 mr-2"></i-lucide>
                  Add Widget
                </p>
                <div class="flex flex-wrap gap-2 mt-4 justify-center">
                  <a
                    href="/dashboards/{{
                      dashboardAndWidgets.dashboard.id
                    }}/widgets/add/clock"
                    class="text-xs bg-gray-200 hover:bg-pastel-blue hover:text-white px-3 py-1 rounded-full transition-colors whitespace-nowrap"
                  >
                    Clock
                  </a>
                  <a
                    href="/dashboards/{{
                      dashboardAndWidgets.dashboard.id
                    }}/widgets/add/calendar"
                    class="text-xs bg-gray-200 hover:bg-pastel-blue hover:text-white px-3 py-1 rounded-full transition-colors whitespace-nowrap"
                  >
                    Calendar
                  </a>
                  <a
                    href="/dashboards/{{
                      dashboardAndWidgets.dashboard.id
                    }}/widgets/add/habits"
                    class="text-xs bg-gray-200 hover:bg-pastel-blue hover:text-white px-3 py-1 rounded-full transition-colors whitespace-nowrap"
                  >
                    Habits
                  </a>
                </div>
              </div>
            </div>
          }
        } @empty {
          <div
            class="col-span-full text-center py-12 flex flex-col items-center"
          >
            <div class="inline-block p-4 bg-gray-100 rounded-full mb-4">
              <i-lucide
                name="layout-dashboard"
                class="w-12 h-12 text-gray-400"
              ></i-lucide>
            </div>

            <h3 class="text-2xl font-bold text-gray-700 mb-2">
              No widgets yet
            </h3>
            <p class="text-gray-500 max-w-md mx-auto mb-8">
              Get started by adding your first widget to this dashboard.
            </p>

            <!-- "Add Widget" Button -->
            <div
              class="border-4 border-dashed border-gray-200 rounded-2xl transition-all duration-300 hover:border-pastel-blue/50 hover:bg-pastel-blue/5 p-8 flex flex-col items-center justify-center dark:border-gray-700 dark:hover:bg-pastel-blue/10"
            >
              <p
                class="text-gray-500 hover:text-pastel-blue font-bold text-lg flex items-center justify-center mb-4"
              >
                <i-lucide name="plus" class="w-6 h-6 mr-2"></i-lucide>
                Add Widget
              </p>
              <div class="flex flex-wrap gap-2 justify-center">
                <a
                  href="/dashboards/{{
                    dashboardAndWidgets.dashboard.id
                  }}/widgets/add/clock"
                  class="text-xs bg-gray-200 hover:bg-pastel-blue hover:text-white px-3 py-1 rounded-full transition-colors whitespace-nowrap"
                >
                  Clock
                </a>
                <a
                  href="/dashboards/{{
                    dashboardAndWidgets.dashboard.id
                  }}/widgets/add/calendar"
                  class="text-xs bg-gray-200 hover:bg-pastel-blue hover:text-white px-3 py-1 rounded-full transition-colors whitespace-nowrap"
                >
                  Calendar
                </a>
                <a
                  href="/dashboards/{{
                    dashboardAndWidgets.dashboard.id
                  }}/widgets/add/habits"
                  class="text-xs bg-gray-200 hover:bg-pastel-blue hover:text-white px-3 py-1 rounded-full transition-colors whitespace-nowrap"
                >
                  Habits
                </a>
              </div>
            </div>
          </div>
        }
      </div>
    }
  `,
})
export default class DashboardsEditPageComponent {
  private readonly dashboardsService = inject(DashboardsService);
  private readonly widgetsService = inject(WidgetsService);
  private readonly router = inject(Router);

  private readonly route = inject(ActivatedRoute);

  readonly dashboardAndWidgets$ = this.route.paramMap.pipe(
    map(params => params.get('dashboardId')),
    switchMap(dashboardId =>
      dashboardId
        ? forkJoin({
            dashboard: this.dashboardsService
              .read(dashboardId)
              .pipe(
                tap(
                  dashboard =>
                    (this.model = { ...dashboard } as UpdateDashboardType)
                )
              ),
            widgets: this.widgetsService.list(dashboardId),
          })
        : of(null)
    ),
    shareReplay(1)
  );

  form = new UntypedFormGroup({});
  model: UpdateDashboardType = {
    id: '',
    name: '',
    isBlackTheme: false,
    isActive: true,
  };
  fields: FormlyFieldConfig[] = DASHBOARD_FORMLY_FIELDS;

  onSubmit(model: UpdateDashboardType) {
    this.dashboardsService
      .update(model)
      .pipe(
        first(),
        tap(() => this.router.navigate(['/dashboards']))
      )
      .subscribe();
  }
}
