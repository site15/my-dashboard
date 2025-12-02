import { RouteMeta } from '@analogjs/router';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import { first, map, shareReplay, tap } from 'rxjs';

import { WidgetsType } from '../../../../../../server/widgets/widgets';
import { NoSanitizePipe } from '../../../../../directives/no-sanitize.directive';
import { ShowNavGuard } from '../../../../../guards/nav.guard';
import { WidgetsService } from '../../../../../services/widgets.service';
import {
  mapToRenderDataByDashboardIdAndWidgetId,
  mapToRenderHtml,
} from '../../../../../utils/render.utils';

export const routeMeta: RouteMeta = {
  canActivate: [ShowNavGuard],
};

@Component({
  selector: 'dashboards-widgets-edit-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormlyBootstrapModule,
    ReactiveFormsModule,
    FormlyForm,
    AsyncPipe,
    NoSanitizePipe,
  ],
  template: ` @if (data$ | async; as data) {
    <section>
      <div class="pico">
        <h3>
          <nav aria-label="breadcrumb">
            <ul>
              <li><a href="/dashboards">Dashboards</a></li>
              <li>
                <a href="/dashboards/{{ data.dashboard.id }}">
                  {{ data.dashboard.name }}
                </a>
              </li>

              <li>Edit {{ data.widget.type }}</li>
            </ul>
          </nav>
        </h3>
        <hr />
        <form
          [formGroup]="form"
          (ngSubmit)="onSubmit({ type: data.widget.type, id: data.widget.id })"
        >
          <formly-form
            [form]="form"
            [fields]="fields"
            [(model)]="model"
          ></formly-form>
          <div class="grid">
            <a
              href="/dashboards/{{ data.dashboard.id }}/widgets/{{
                data.widget.id
              }}/delete"
              type="button"
              class="secondary"
              >Remove</a
            >
            <button type="submit">Save</button>
          </div>
        </form>

        <hr />
      </div>

      <div [innerHTML]="html$ | async | noSanitize"></div>

      <hr />
    </section>
  }`,
})
export default class DashboardsWidgetsEditPageComponent {
  private readonly widgetsService = inject(WidgetsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  form = new UntypedFormGroup({});
  fields: FormlyFieldConfig[] = [];
  model = {};

  readonly data$ = this.route.paramMap.pipe(
    map(params => ({
      dashboardId: params.get('dashboardId'),
      widgetId: params.get('widgetId'),
    })),
    mapToRenderDataByDashboardIdAndWidgetId(),
    tap(data => {
      if (data) {
        this.model = data.model;
        this.fields = data.fields;
      }
    }),
    shareReplay(1)
  );

  html$ = this.data$.pipe(mapToRenderHtml(true));

  onSubmit(data: { type: string; id: string }) {
    this.widgetsService
      .update({
        ...data,
        options: {
          ...this.model,
          type: data.type,
        } as WidgetsType,
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
