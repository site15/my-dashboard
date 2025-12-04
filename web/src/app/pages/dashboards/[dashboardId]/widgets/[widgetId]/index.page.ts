import { RouteMeta } from '@analogjs/router';
import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import { LucideAngularModule } from 'lucide-angular';
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
    LucideAngularModule,
    TitleCasePipe,
  ],
  template: ` @if (data$ | async; as data) {
    <h1 class="text-4xl font-extrabold text-gray-800 mb-2">
      <a href="/dashboards">Dashboards</a>:
      <a href="/dashboards/{{ data.dashboard.id }}">{{ data.dashboard.name }}</a>:
      Edit {{ data.widget.type | titlecase }} Widget
    </h1>
    <p class="text-xl text-gray-500 mb-8">Update your widget settings.</p>

    <!-- Widget Configuration Panel -->
    <div class="bg-white p-6 rounded-2xl long-shadow mb-8 space-y-4">
      <form
        [formGroup]="form"
        (ngSubmit)="onSubmit({ type: data.widget.type, id: data.widget.id })"
      >
        <formly-form
          [form]="form"
          [fields]="fields"
          [(model)]="model"
        ></formly-form>
        <div class="flex gap-4">
          <a
            href="/dashboards/{{ data.dashboard.id }}/widgets/{{
              data.widget.id
            }}/delete"
            class="flex items-center text-lg font-bold py-3 px-6 rounded-xl text-white transition-all duration-300 transform hover:scale-[1.02] flat-btn-shadow mb-8 
              bg-gradient-to-tr from-[#FF988A] to-[#FFD5A2] text-gray-800 cursor-pointer"
          >
            <i-lucide name="trash-2" class="w-5 h-5 mr-2"></i-lucide>
            Delete Widget
          </a>
          
          <a
            href="/dashboards/{{ data.dashboard.id }}"
            class="flex items-center text-lg font-bold py-3 px-6 rounded-xl text-white bg-gray-500 transition-all duration-300 transform hover:scale-[1.02] flat-btn-shadow mb-8 
              bg-gradient-to-tr from-[#9CA3AF] to-[#6B7280] tracking-wide cursor-pointer"
          >
            <i-lucide name="x" class="w-5 h-5 mr-2"></i-lucide>
            Cancel
          </a>
          
          <button 
            type="submit"
            class="flex items-center text-lg font-bold py-3 px-6 rounded-xl text-white bg-pastel-blue transition-all duration-300 transform hover:scale-[1.02] flat-btn-shadow mb-8 
              bg-gradient-to-tr from-[#8A89F0] to-[#A2C0F5] tracking-wide cursor-pointer"
          >
            <i-lucide name="save" class="w-5 h-5 mr-2"></i-lucide>
            Save Changes
          </button>
        </div>
      </form>
    </div>

    <!-- Widget Preview -->
    <h2 class="text-3xl font-bold text-gray-800 mb-6">Widget Preview</h2>
    <div class="bg-white p-6 rounded-2xl long-shadow">
      <div [innerHTML]="html$ | async | noSanitize"></div>
    </div>
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