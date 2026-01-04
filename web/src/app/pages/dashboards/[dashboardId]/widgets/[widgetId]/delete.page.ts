import { RouteMeta } from '@analogjs/router';
import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { LucideAngularModule } from 'lucide-angular';
import { first, forkJoin, map, of, shareReplay, switchMap, tap } from 'rxjs';

import { ShowNavGuard } from '../../../../../guards/nav.guard';
import { DashboardsService } from '../../../../../services/dashboards.service';
import { WidgetsService } from '../../../../../services/widgets.service';

export const routeMeta: RouteMeta = {
  canActivate: [ShowNavGuard],
};

@Component({
  selector: 'dashboards-widgets-delete-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormlyBootstrapModule,
    AsyncPipe,
    TitleCasePipe,
    ReactiveFormsModule,
    LucideAngularModule,
  ],
  template: ` @if (dashboardAndWidget$ | async; as dashboardAndWidget) {
    <h1 class="text-4xl font-extrabold text-gray-800 mb-2">
      Delete {{ dashboardAndWidget.widget.type | titlecase }} Widget
    </h1>

    <p class="text-xl text-gray-500 mb-8">
      <a
        href="/dashboards/{{ dashboardAndWidget.dashboard.id }}/widgets/{{
          dashboardAndWidget.widget.id
        }}"
        class="text-gray-500 hover:text-pastel-blue transition-colors mb-10 mt-2 flex items-center"
      >
        <i-lucide name="arrow-left" class="w-6 h-6 mr-0 lg:mr-2"></i-lucide>
        <span class="mobile-hidden lg:inline text-lg font-medium"
          >Back to Widget</span
        >
      </a>
      Permanently remove this widget.
    </p>

    <!-- Widget Deletion Panel -->
    <div class="bg-white p-6 rounded-2xl long-shadow mb-8 space-y-4">
      <form
        [formGroup]="form"
        (ngSubmit)="
          onSubmit(
            dashboardAndWidget.dashboard.id,
            dashboardAndWidget.widget.id
          )
        "
        class="w-full"
      >
        <div class="mb-6">
          <p class="text-lg text-gray-700 mb-2">
            Are you sure you want to delete the
            <span class="font-bold">{{
              dashboardAndWidget.widget.type | titlecase
            }}</span>
            widget from the
            <span class="font-bold">{{
              dashboardAndWidget.dashboard.name
            }}</span>
            dashboard?
          </p>
          <p class="text-gray-500">
            This action cannot be undone. All data associated with this widget
            will be permanently removed.
          </p>
        </div>

        <div class="flex gap-4">
          <a
            href="/dashboards/{{ dashboardAndWidget.dashboard.id }}/widgets/{{
              dashboardAndWidget.widget.id
            }}"
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
            Delete Widget
          </button>
        </div>
      </form>
    </div>
  }`,
})
export default class DashboardsWidgetsDeletePageComponent {
  private readonly dashboardsService = inject(DashboardsService);
  private readonly widgetsService = inject(WidgetsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  form = new UntypedFormGroup({});

  readonly dashboardAndWidget$ = this.route.paramMap.pipe(
    map(params => ({
      dashboardId: params.get('dashboardId'),
      widgetId: params.get('widgetId'),
    })),
    switchMap(({ dashboardId, widgetId }) =>
      dashboardId && widgetId
        ? forkJoin({
            dashboard: this.dashboardsService.read(dashboardId),
            widget: this.widgetsService.read(widgetId),
          })
        : of(null)
    ),
    shareReplay(1)
  );

  onSubmit(dashboardId: string, widgetId: string) {
    this.widgetsService
      .delete(widgetId)
      .pipe(
        first(),
        tap(() => this.router.navigate([`/dashboards/${dashboardId}`]))
      )
      .subscribe();
  }
}
