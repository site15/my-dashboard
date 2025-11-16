import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import { first, forkJoin, map, of, shareReplay, switchMap, tap } from 'rxjs';

import { UpdateDashboardType } from '../../../../server/types/DashboardSchema';
import { DashboardsService } from '../../../services/dashboards.service';
import { WidgetsService } from '../../../services/widgets.service';

@Component({
  selector: 'dashboards-item-page',
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
      <section>
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

      <h4>Widgets ({{ dashboardAndWidgets.widgets.length }})</h4>

      <div class="grid">
        <a
          href="/dashboards/{{
            dashboardAndWidgets.dashboard.id
          }}/widgets/add/clock"
          >Add clock</a
        >
        <a
          href="/dashboards/{{
            dashboardAndWidgets.dashboard.id
          }}/widgets/add/calendar"
          >Add calendar</a
        >
      </div>
      <hr />

      @for (widget of dashboardAndWidgets.widgets; track widget.id) {
        <details name="widget" open>
          <summary>
            {{ widget.type }}
            <a
              href="/dashboards/{{
                dashboardAndWidgets.dashboard.id
              }}/widgets/{{ widget.id }}"
              >Edit</a
            >
            <a
              href="/dashboards/{{
                dashboardAndWidgets.dashboard.id
              }}/widgets/{{ widget.id }}/delete"
              >Delete</a
            >
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
    }
  `,
})
export default class DashboardsItemPageComponent {
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
            widgets: this.widgetsService.list(),
          })
        : of(null)
    ),
    shareReplay(1)
  );

  form = new UntypedFormGroup({});
  model: UpdateDashboardType = { id: '', name: '', isBlackTheme: false };
  fields: FormlyFieldConfig[] = [
    {
      key: 'name',
      type: 'input',
      props: {
        label: 'Name',
        placeholder: 'Enter name',
        required: true,
        attributes: { 'aria-label': 'Name' },
      },
    },
    {
      key: 'isBlackTheme',
      type: 'checkbox',
      props: {
        label: 'Is black theme',
        attributes: { 'aria-label': 'Is black theme' },
      },
    },
  ];

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
