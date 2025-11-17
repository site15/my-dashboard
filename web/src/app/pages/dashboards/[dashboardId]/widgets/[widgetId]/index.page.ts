import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import { first, forkJoin, map, of, shareReplay, switchMap, tap } from 'rxjs';

import { UpdateWidgetType } from '../../../../../../server/types/WidgetSchema';
import { DashboardsService } from '../../../../../services/dashboards.service';
import { WidgetsService } from '../../../../../services/widgets.service';

@Component({
  selector: 'dashboards-widgets-edit-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormlyBootstrapModule, ReactiveFormsModule, FormlyForm, AsyncPipe],
  template: ` @if (dashboardAndWidget$ | async; as dashboardAndWidget) {
    <section>
      <h3>
        <nav aria-label="breadcrumb">
          <ul>
            <li><a href="/dashboards">Dashboards</a></li>
            <li>
              <a href="/dashboards/{{ dashboardAndWidget.dashboard.id }}">
                {{ dashboardAndWidget.dashboard.name }}
              </a>
            </li>

            <li>Edit {{ dashboardAndWidget.widget.type }}</li>
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
          <button type="submit">Save</button>
        </div>
      </form>

      <hr />
    </section>
  }`,
})
export default class DashboardsWidgetsEditPageComponent {
  private readonly dashboardsService = inject(DashboardsService);
  private readonly widgetsService = inject(WidgetsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  form = new UntypedFormGroup({});
  model: UpdateWidgetType = {
    id: '',
    options: '',
    state: '',
  };
  fields: FormlyFieldConfig[] = [
    {
      key: 'options',
      type: 'textarea',
      props: {
        label: 'Options',
        placeholder: 'Enter options',
        attributes: { 'aria-label': 'Options' },
      },
    },
    {
      key: 'state',
      type: 'textarea',
      props: {
        label: 'State',
        placeholder: 'Enter state',
        attributes: { 'aria-label': 'State' },
      },
    },
  ];

  readonly dashboardAndWidget$ = this.route.paramMap.pipe(
    map(params => ({
      dashboardId: params.get('dashboardId'),
      widgetId: params.get('widgetId'),
    })),
    switchMap(({ dashboardId, widgetId }) =>
      dashboardId && widgetId
        ? forkJoin({
            dashboard: this.dashboardsService.read(dashboardId),
            widget: this.widgetsService
              .read(widgetId)
              .pipe(tap(widget => (this.model = widget as UpdateWidgetType))),
          })
        : of(null)
    ),
    shareReplay(1)
  );

  onSubmit(model: UpdateWidgetType) {
    this.widgetsService
      .update(model)
      .pipe(
        first(),
        tap(widget =>
          this.router.navigate([`/dashboards/${widget.dashboardId}`])
        )
      )
      .subscribe();
  }
}
