import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  SecurityContext,
} from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import { first, forkJoin, map, of, shareReplay, switchMap, tap } from 'rxjs';

import {
  WIDGETS_FORMLY_FIELDS,
  WIDGETS_RENDERERS,
  WidgetsType,
} from '../../../../../../server/widgets/widgets';
import { mapFormlyTypes } from '../../../../../formly/get-formly-type';
import { DashboardsService } from '../../../../../services/dashboards.service';
import { WidgetsService } from '../../../../../services/widgets.service';

@Component({
  selector: 'dashboards-widgets-edit-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormlyBootstrapModule, ReactiveFormsModule, FormlyForm, AsyncPipe],
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

      <div [innerHTML]="safeHtmlContent$ | async"></div>

      <hr />
    </section>
  }`,
})
export default class DashboardsWidgetsEditPageComponent {
  private readonly dashboardsService = inject(DashboardsService);
  private readonly widgetsService = inject(WidgetsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);

  form = new UntypedFormGroup({});
  fields: FormlyFieldConfig[] = [];
  model = {};

  readonly data$ = this.route.paramMap.pipe(
    map(params => ({
      dashboardId: params.get('dashboardId'),
      widgetId: params.get('widgetId'),
    })),
    switchMap(({ dashboardId, widgetId }) =>
      dashboardId && widgetId
        ? forkJoin({
            dashboard: this.dashboardsService.read(dashboardId),
            widget: this.widgetsService.read(widgetId).pipe(
              map(widget => {
                this.model = widget.options;
                this.fields = mapFormlyTypes(
                  WIDGETS_FORMLY_FIELDS[widget.type] || []
                );
                return widget;
              })
            ),
          })
        : of(null)
    ),
    shareReplay(1)
  );

  safeHtmlContent$ = this.data$.pipe(
    switchMap(data => {
      const render =
        data?.widget.type && WIDGETS_RENDERERS[data.widget.type]
          ? WIDGETS_RENDERERS[data.widget.type]
          : null;
      return forkJoin({
        render: of(render),
        html:
          render && data?.widget
            ? render.render(data?.widget, {
                static: true,
              })
            : '',
        widget: of(data?.widget),
      });
    }),
    map(({ render, html, widget }) => {
      setTimeout(() => {
        if (widget) {
          render?.init?.(widget);
          render?.afterRender?.(widget);
        }
      });
      return this.sanitizer.sanitize(SecurityContext.HTML, html);
    })
  );

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
