import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import { first, map, of, shareReplay, switchMap, tap } from 'rxjs';

import { CreateWidgetType } from '../../../../../../server/types/WidgetSchema';
import { DashboardsService } from '../../../../../services/dashboards.service';
import { WidgetsService } from '../../../../../services/widgets.service';

@Component({
  selector: 'dashboards-add-clock-widget-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormlyBootstrapModule, ReactiveFormsModule, FormlyForm, AsyncPipe],
  template: ` @if (dashboard$ | async; as dashboard) {
    <section>
      <h3>
        <nav aria-label="breadcrumb">
          <ul>
            <li><a href="/dashboards">Dashboards</a></li>
            <li>{{ dashboard.name }}</li>
            <li>Add clock</li>
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
          <button type="submit">Add</button>
        </div>
      </form>

      <hr />
    </section>
  }`,
})
export default class DashboardsAddClockWidgetPageComponent {
  private readonly dashboardsService = inject(DashboardsService);
  private readonly widgetsService = inject(WidgetsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  form = new UntypedFormGroup({});
  model: CreateWidgetType = {
    type: 'clock',
    options: '',
    state: '',
    dashboardId: '',
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

  readonly dashboard$ = this.route.paramMap.pipe(
    map(params => params.get('dashboardId')),
    switchMap(dashboardId =>
      dashboardId
        ? this.dashboardsService.read(dashboardId).pipe(
            tap(dashboard => {
              this.model = {
                ...this.model,
                dashboardId: dashboard.id,
              };
            })
          )
        : of(null)
    ),
    shareReplay(1)
  );

  onSubmit(model: CreateWidgetType) {
    this.widgetsService
      .create(model)
      .pipe(
        first(),
        tap(widget =>
          this.router.navigate([`/dashboards/${widget.dashboardId}`])
        )
      )
      .subscribe();
  }
}
