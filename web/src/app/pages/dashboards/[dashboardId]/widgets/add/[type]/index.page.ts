import { RouteMeta } from '@analogjs/router';
import { AsyncPipe, NgIf, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyForm } from '@ngx-formly/core';
import { LucideAngularModule } from 'lucide-angular';
import { catchError, first, map, of, shareReplay, switchMap, tap } from 'rxjs';

import { ClientValidationErrorType } from '../../../../../../../server/types/client-error-type';
import { CreateWidgetType } from '../../../../../../../server/types/WidgetSchema';
import {
  WIDGETS_FORMLY_FIELDS,
  WIDGETS_RENDERERS,
  WidgetsType,
} from '../../../../../../../server/widgets/widgets';
import { mapFormlyTypes } from '../../../../../../formly/get-formly-type';
import { ShowNavGuard } from '../../../../../../guards/nav.guard';
import { DashboardsService } from '../../../../../../services/dashboards.service';
import { ErrorHandlerService } from '../../../../../../services/error-handler.service';
import { FormHandlerService } from '../../../../../../services/form-handler.service';
import { WidgetsService } from '../../../../../../services/widgets.service';

export const routeMeta: RouteMeta = {
  canActivate: [ShowNavGuard],
};

@Component({
  selector: 'dashboards-widgets-add-by-type-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormlyBootstrapModule,
    ReactiveFormsModule,
    FormlyForm,
    AsyncPipe,
    NgIf,
    LucideAngularModule,
    TitleCasePipe,
  ],
  template: `
    @if (data$ | async; as data) {
      <h1 class="text-4xl font-extrabold text-gray-800 mb-2">
        Add {{ data.type | titlecase }} Widget
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
        Configure your new widget.
      </p>

      <!-- Widget Configuration Panel -->
      <div class="bg-white p-6 rounded-2xl long-shadow mb-8 space-y-4">
        @if (formFields$ | async; as formlyFields) {
          <form
            [formGroup]="form"
            (ngSubmit)="
              onSubmit({ type: data.type, dashboardId: data.dashboard.id })
            "
          >
            <formly-form
              [form]="form"
              [fields]="formlyFields || []"
              [(model)]="formModel"
            ></formly-form>
            <div class="flex gap-4">
              <a
                href="/dashboards/{{ data.dashboard.id }}"
                class="flex items-center text-lg font-bold py-3 px-6 rounded-xl text-white bg-gray-500 transition-all duration-300 transform hover:scale-[1.02] flat-btn-shadow mb-8 
                  bg-gradient-to-tr from-[#AAB1BF] to-[#8B92A0] tracking-wide cursor-pointer"
              >
                <i-lucide name="x" class="w-5 h-5 mr-2"></i-lucide>
                Cancel
              </a>

              <button
                type="submit"
                class="flex items-center text-lg font-bold py-3 px-6 rounded-xl text-white bg-pastel-blue transition-all duration-300 transform hover:scale-[1.02] flat-btn-shadow mb-8 
                  bg-gradient-to-tr from-[#8A89F0] to-[#A2C0F5] tracking-wide flex items-center justify-center cursor-pointer"
              >
                <i-lucide name="plus" class="w-5 h-5 mr-2"></i-lucide>
                Create Widget
              </button>
            </div>
          </form>
        }
      </div>
    }
  `,
})
export default class DashboardsWidgetsAddByTypePageComponent {
  private readonly widgetsService = inject(WidgetsService);
  private readonly errorHandlerService = inject(ErrorHandlerService);
  private readonly dashboardsService = inject(DashboardsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly formHandlerService = inject(FormHandlerService);

  form = new UntypedFormGroup({});
  formModel: any = {};
  formFields$ = this.formHandlerService.createFormFieldsSubject();
  widgetType: string = '';

  readonly data$ = this.route.paramMap.pipe(
    map(params => ({
      dashboardId: params.get('dashboardId'),
      type: params.get('type'),
    })),
    switchMap(({ dashboardId, type }) =>
      dashboardId && type
        ? this.dashboardsService.read(dashboardId).pipe(
            tap(() => {
              this.widgetType = type;
              this.formModel = {};
              this.setFormFields();
            }),
            map(dashboard => ({
              type: type,
              dashboard,
            }))
          )
        : of(null)
    ),
    shareReplay(1)
  );

  private setFormFields(options?: { clientError?: ClientValidationErrorType }) {
    this.formHandlerService.updateFormFields(this.formFields$, {
      baseFields: WIDGETS_FORMLY_FIELDS[this.widgetType] || [],
      clientError: options?.clientError,
      mapFields: mapFormlyTypes,
      rootPath: `options`,
    });
  }

  onSubmit(data: { type: string; dashboardId: string }) {
    this.setFormFields({});

    const widget = {
      dashboardId: data.dashboardId,
      type: data.type,
      options: {
        ...this.formModel,
        type: data.type,
      } as unknown as WidgetsType,
    } as CreateWidgetType;

    WIDGETS_RENDERERS[data.type].beforeSave?.(widget);

    this.widgetsService
      .create(widget)
      .pipe(
        catchError(err =>
          this.errorHandlerService.catchAndProcessServerError({
            err,
            setFormlyFields: options => this.setFormFields(options),
          })
        ),
        first(),
        tap(
          widget =>
            widget &&
            this.router.navigate([`/dashboards/${widget.dashboardId}`])
        )
      )
      .subscribe();
  }
}
