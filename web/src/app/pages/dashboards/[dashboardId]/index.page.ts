import { RouteMeta } from '@analogjs/router';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
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
    JsonPipe,
    ReactiveFormsModule,
    FormlyForm,
  ],
  template: `
    @if (dashboardAndWidgets$ | async; as dashboardAndWidgets) {
      <section class="pico">
        <h3>
          <nav aria-label="breadcrumb">
            <ul>
              <li><a href="/dashboards">Dashboards</a></li>
              <li>{{ dashboardAndWidgets.dashboard.name }}</li>
            </ul>
          </nav>
        </h3>
        <hr />

        <form [formGroup]="form" (ngSubmit)="onSubmit(model)">
          <formly-form
            [form]="form"
            [fields]="fields"
            [model]="model"
          ></formly-form>
          <div class="grid">
            <a
              href="/dashboards/{{ dashboardAndWidgets.dashboard.id }}/delete"
              type="button"
              class="secondary"
              >Remove</a
            >
            <a
              href="/dashboards/{{
                dashboardAndWidgets.dashboard.id
              }}/link-device"
              type="button"
              class="contrast"
              >Link device</a
            >
            <button type="submit">Save</button>
          </div>
        </form>

        <hr />
      </section>
      <div class="pico">
        <hgroup>
          <h4>Widgets ({{ dashboardAndWidgets.widgets.length }})</h4>
          <p>
            <a
              href="/dashboards/{{
                dashboardAndWidgets.dashboard.id
              }}/widgets/add/clock"
              >Add clock</a
            >
            <a
              style="padding-left: 1rem;"
              href="/dashboards/{{
                dashboardAndWidgets.dashboard.id
              }}/widgets/add/calendar"
              >Add calendar</a
            >
            <a
              style="padding-left: 1rem;"
              href="/dashboards/{{
                dashboardAndWidgets.dashboard.id
              }}/widgets/add/habits"
              >Add habits</a
            >
          </p>
        </hgroup>

        <hr />

        @for (widget of dashboardAndWidgets.widgets; track widget.id) {
          <details name="widget" open>
            <summary>
              <hgroup>
                <h5>{{ widget.type }}</h5>
                <p>
                  <a
                    href="/dashboards/{{
                      dashboardAndWidgets.dashboard.id
                    }}/widgets/{{ widget.id }}"
                    >Edit</a
                  >
                </p>
              </hgroup>
            </summary>
            <p>{{ widget | json }}</p>
          </details>
          <hr />
        } @empty {
          <details name="widget" open>
            <summary>There are no widgets</summary>
          </details>
          <hr />
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
                  dashboard => (this.model = dashboard as UpdateDashboardType)
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
