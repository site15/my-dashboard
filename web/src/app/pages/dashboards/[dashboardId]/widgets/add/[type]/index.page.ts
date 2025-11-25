import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import { first, map, of, shareReplay, switchMap, tap } from 'rxjs';

import {
  WIDGETS_FORMLY_FIELDS,
  WidgetsType,
} from '../../../../../../../server/widgets/widgets';
import { mapFormlyTypes } from '../../../../../../formly/get-formly-type';
import { DashboardsService } from '../../../../../../services/dashboards.service';
import { WidgetsService } from '../../../../../../services/widgets.service';

@Component({
  selector: 'dashboards-widgets-add-by-type-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormlyBootstrapModule, ReactiveFormsModule, FormlyForm, AsyncPipe],
  template: ` @if (data$ | async; as data) {
    <section class="pico">
      <h3>
        <nav aria-label="breadcrumb">
          <ul>
            <li><a href="/dashboards">Dashboards</a></li>
            <li>
              <a href="/dashboards/{{ data.dashboard.id }}">{{
                data.dashboard.name
              }}</a>
            </li>
            <li>Add {{ data.type }}</li>
          </ul>
        </nav>
      </h3>
      <hr />

      <form
        [formGroup]="form"
        (ngSubmit)="
          onSubmit({ type: data.type, dashboardId: data.dashboard.id })
        "
      >
        <formly-form
          [form]="form"
          [fields]="fields"
          [(model)]="model"
        ></formly-form>
        <div class="grid">
          <button type="submit">Add</button>
        </div>
      </form>

      <hr />
    </section>
  }`,
})
export default class DashboardsWidgetsAddByTypePageComponent {
  private readonly dashboardsService = inject(DashboardsService);
  private readonly widgetsService = inject(WidgetsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  form = new UntypedFormGroup({});
  fields: FormlyFieldConfig[] = [];
  model = {};

  readonly data$ = this.route.paramMap.pipe(
    map(params => ({
      dashboardId: params.get('dashboardId'),
      type: params.get('type'),
    })),
    switchMap(({ dashboardId, type }) =>
      dashboardId && type
        ? this.dashboardsService.read(dashboardId).pipe(
            map(dashboard => {
              this.fields = mapFormlyTypes(WIDGETS_FORMLY_FIELDS[type] || []);
              return {
                type: type,
                dashboard,
              };
            })
          )
        : of(null)
    ),
    shareReplay(1)
  );

  onSubmit(data: { type: string; dashboardId: string }) {
    console.log(this.model, this);
    this.widgetsService
      .create({
        dashboardId: data.dashboardId,
        type: data.type,
        options: { ...this.model, type: data.type } as unknown as WidgetsType,
      })
      .pipe(
        first(),
        tap(widget =>
          this.router.navigate([`/dashboards/${widget.dashboardId}`])
        )
      )
      .subscribe();
  }
}
