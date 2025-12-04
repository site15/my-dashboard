import { RouteMeta } from '@analogjs/router';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

import { ShowNavGuard } from '../../guards/nav.guard';
import { DashboardsService } from '../../services/dashboards.service';

export const routeMeta: RouteMeta = {
  canActivate: [ShowNavGuard],
};

@Component({
  selector: 'dashboards-list-page',
  standalone: true,
  imports: [AsyncPipe, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <h1 class="text-4xl font-extrabold text-gray-800 mb-2">
      Dashboards
    </h1>
    <p class="text-xl text-gray-500 mb-8">
      Manage all your projects in one place.
    </p>

    @if ((dashboards$ | async)?.length) {
      <a
        class="flex items-center text-lg font-bold py-3 px-6 rounded-xl text-white bg-pastel-blue transition-all duration-300 transform hover:scale-[1.02] flat-btn-shadow mb-8 
                bg-gradient-to-tr from-[#8A89F0] to-[#A2C0F5] tracking-wide flex items-center justify-center"
        href="/dashboards/new"
      >
        <i-lucide name="plus" class="w-5 h-5 mr-2"></i-lucide>
        Create New Dashboard
      </a>
    }

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      @for (dashboard of dashboards$ | async; track dashboard.id) {
        <a
          class="bg-white p-6 rounded-2xl long-shadow transition-all duration-300 hover:scale-[1.01] cursor-pointer"
          href="/dashboards/{{ dashboard.id }}"
        >
          <div class="flex justify-between items-start mb-4">
            <!--i
              data-lucide="database"
              class="w-10 h-10 text-pastel-blue bg-pastel-blue/10 p-2 rounded-lg"
            ></i-->
            <span
              class="text-sm font-medium text-gray-500 px-3 py-1 bg-gray-100 rounded-full"
              >{{ dashboard.isActive ? 'Active' : 'Draft' }}</span
            >
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">
            {{ dashboard.name }}
          </h2>
          <div
            class="flex justify-between items-center text-sm font-medium text-gray-600 pt-2 border-t border-gray-100"
          >
            <span>Widgets: {{ dashboard.widgetsCount }}</span>
            <span
              class="flex items-center text-pastel-blue hover:text-pastel-blue/80"
            >
              Open
              <i-lucide name="arrow-right" class="w-4 h-4 ml-1"></i-lucide>
            </span>
          </div>
        </a>
      } @empty {
        <div class="col-span-full text-center py-12 flex flex-col items-center">
          <div class="inline-block p-4 bg-gray-100 rounded-full mb-4">
            <i
              data-lucide="layout-dashboard"
              class="w-12 h-12 text-gray-400"
            ></i>
          </div>
          <h3 class="text-2xl font-bold text-gray-700 mb-2">
            No dashboards yet
          </h3>
          <p class="text-gray-500 max-w-md mx-auto">
            Get started by creating your first dashboard to organize and
            visualize your data.
          </p>
          <p class="max-w-md mx-auto">
            <a
              class="flex items-center text-lg font-bold py-3 px-6 rounded-xl text-white bg-pastel-blue transition-all duration-300 transform hover:scale-[1.02] flat-btn-shadow mb-8 
                bg-gradient-to-tr from-[#8A89F0] to-[#A2C0F5] tracking-wide"
              href="/dashboards/new"
            >
              <i-lucide name="plus" class="w-5 h-5 mr-2"></i-lucide>
              Create New Dashboard
            </a>
          </p>
        </div>
      }
    </div>`,
})
export default class DashboardsListPageComponent {
  private readonly dashboardsService = inject(DashboardsService);

  readonly dashboards$ = this.dashboardsService.list();
}
