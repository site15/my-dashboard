/* eslint-disable @typescript-eslint/no-explicit-any */
import { RouteMeta } from '@analogjs/router';
import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyForm } from '@ngx-formly/core';
import { LucideAngularModule } from 'lucide-angular';
import { catchError, first, map, shareReplay, tap } from 'rxjs';

import { ClientValidationErrorType } from '../../../../../../server/types/client-error-type';
import {
  WIDGETS_FORMLY_FIELDS,
  WIDGETS_RENDERERS,
  WidgetsType,
} from '../../../../../../server/widgets/widgets';
import { NoSanitizePipe } from '../../../../../directives/no-sanitize.directive';
import { mapFormlyTypes } from '../../../../../formly/get-formly-type';
import { ShowNavGuard } from '../../../../../guards/nav.guard';
import { ErrorHandlerService } from '../../../../../services/error-handler.service';
import { FormHandlerService } from '../../../../../services/form-handler.service';
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
      Edit {{ data.widget.type | titlecase }} Widget
    </h1>

    <p class="text-xl text-gray-500 mb-8">
      <a
        href="/dashboards/{{ data.dashboard.id }}"
        class="text-gray-500 hover:text-pastel-blue transition-colors mb-10 mt-2 flex items-center"
      >
        <i-lucide name="arrow-left" class="w-6 h-6 mr-0 lg:mr-2"></i-lucide>
        <span class="hidden lg:inline text-lg font-medium"
          >Dashboard "{{ data.dashboard.name }}"</span
        >
      </a>
      Update your widget settings.
    </p>

    <!-- Widget Configuration Panel -->
    <div class="bg-white p-6 rounded-2xl long-shadow mb-8 space-y-4">
      @if (formFields$ | async; as formlyFields) {
        <form
          [formGroup]="form"
          (ngSubmit)="onSubmit({ type: data.widget.type, id: data.widget.id })"
        >
          <formly-form
            [form]="form"
            [fields]="formlyFields || []"
            [(model)]="formModel"
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
      }
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
  private readonly errorHandlerService = inject(ErrorHandlerService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly formHandlerService = inject(FormHandlerService);

  form = new UntypedFormGroup({});
  formModel: any = {};
  formFields$ = this.formHandlerService.createFormFieldsSubject();

  readonly data$ = this.route.paramMap.pipe(
    map(params => ({
      dashboardId: params.get('dashboardId'),
      widgetId: params.get('widgetId'),
    })),
    mapToRenderDataByDashboardIdAndWidgetId(),
    tap(data => {
      if (data) {
        this.formModel = data.model;
        this.setFormFields();
      }
    }),
    shareReplay(1)
  );

  html$ = this.data$.pipe(
    mapToRenderHtml(true, (state, widget) => {
      this.widgetsService
        .updateState({ id: widget.id, state })
        .pipe(first())
        .subscribe();
    })
  );

  private setFormFields(options?: { clientError?: ClientValidationErrorType }) {
    this.formHandlerService.updateFormFields(this.formFields$, {
      baseFields: WIDGETS_FORMLY_FIELDS[this.formModel.type] || [],
      clientError: options?.clientError,
      mapFields: mapFormlyTypes,
      rootPath: `options`,
    });
  }

  onSubmit(data: { type: string; id: string }) {
    this.setFormFields({});
    
    const widget = {
      ...data,
      options: {
        ...this.formModel,
        type: data.type,
      } as WidgetsType,
    };

    WIDGETS_RENDERERS[data.type].beforeSave?.(widget);

    this.widgetsService
      .update(widget)
      .pipe(
        catchError(err =>
          this.errorHandlerService.catchAndProcessServerError({
            err,
            setFormlyFields: options => this.setFormFields(options),
          })
        ),
        first(),
        tap(
          async widget =>
            widget &&
            this.router.navigate([`/dashboards/${widget.dashboardId}`])
        )
      )
      .subscribe();
  }
}
