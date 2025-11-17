import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { first, forkJoin, map, of, shareReplay, switchMap, tap } from 'rxjs';

import { DashboardsService } from '../../../../../services/dashboards.service';
import { WidgetsService } from '../../../../../services/widgets.service';

@Component({
  selector: 'dashboards-widgets-delete-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormlyBootstrapModule, AsyncPipe, ReactiveFormsModule],
  template: ` @if (dashboardAndWidget$ | async; as dashboardAndWidget) {
    <section>
      <h3>
        <nav aria-label="breadcrumb">
          <ul>
            <li><a href="/dashboards">Dashboards</a></li>
            <li>
              <a href="/dashboards/{{ dashboardAndWidget.dashboard.id }}">{{
                dashboardAndWidget.dashboard.name
              }}</a>
            </li>
            <li>
              <a href="/dashboards/{{ dashboardAndWidget.widget.id }}">{{
                dashboardAndWidget.widget.type
              }}</a>
            </li>
            <li>Deleting</li>
          </ul>
        </nav>
      </h3>

      <hr />
      <form
        [formGroup]="form"
        (ngSubmit)="
          onSubmit(
            dashboardAndWidget.dashboard.id,
            dashboardAndWidget.widget.id
          )
        "
      >
        Remove widget with type "{{ dashboardAndWidget.widget.type }}" of
        dashboard "{{ dashboardAndWidget.dashboard.name }}" ?

        <div class="grid">
          <a
            href="/dashboards/{{ dashboardAndWidget.dashboard.id }}"
            type="button"
            class="secondary"
            >No</a
          >
          <button type="submit">Yes</button>
        </div>
      </form>
      <hr />
    </section>
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
