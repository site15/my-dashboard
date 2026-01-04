import { RouteMeta } from '@analogjs/router';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyForm } from '@ngx-formly/core';
import { LucideAngularModule } from 'lucide-angular';
import { catchError, first, tap } from 'rxjs';

import { ClientValidationErrorType } from '../../../server/types/client-error-type';
import { CreateDashboardType } from '../../../server/types/DashboardSchema';
import { mapFormlyTypes } from '../../formly/get-formly-type';
import { ShowNavGuard } from '../../guards/nav.guard';
import {
  DASHBOARD_FORMLY_FIELDS,
  DashboardsService,
} from '../../services/dashboards.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { FormHandlerService } from '../../services/form-handler.service';

export const routeMeta: RouteMeta = {
  canActivate: [ShowNavGuard],
};

@Component({
  selector: 'dashboards-new-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormlyBootstrapModule,
    ReactiveFormsModule,
    FormlyForm,
    AsyncPipe,
    LucideAngularModule,
  ],
  template: `
    <h1 class="text-4xl font-extrabold text-gray-800 mb-2">New Dashboard</h1>
    <p class="text-xl text-gray-500 mb-8">
      <a
        href="/dashboards"
        class="text-gray-500 hover:text-pastel-blue transition-colors mb-10 mt-2 flex items-center"
      >
        <i-lucide name="arrow-left" class="w-6 h-6 mr-0 lg:mr-2"></i-lucide>
        <span class="mobile-hidden lg:inline text-lg font-medium"
          >Dashboards</span
        >
      </a>
      Create a new dashboard.
    </p>

    <!-- Control Panel -->
    <div class="bg-white p-6 rounded-2xl long-shadow mb-8 space-y-4">
      @if (formFields$ | async; as formlyFields) {
        <form
          [formGroup]="form"
          (ngSubmit)="onSubmit(formModel)"
          class="w-full"
        >
          <formly-form
            [form]="form"
            [fields]="formlyFields || []"
            [model]="formModel"
          ></formly-form>
          <div class="flex gap-4">
            <button
              class="flex items-center text-lg font-bold py-3 px-6 rounded-xl text-white bg-pastel-blue transition-all duration-300 transform hover:scale-[1.02] flat-btn-shadow mb-8 
                bg-gradient-to-tr from-[#8A89F0] to-[#A2C0F5] tracking-wide flex items-center justify-center cursor-pointer"
              type="submit"
            >
              <i-lucide name="plus" class="w-5 h-5 mr-2"></i-lucide>
              Create Dashboard
            </button>
          </div>
        </form>
      }
    </div>
  `,
})
export default class DashboardsNewPageComponent {
  private readonly errorHandlerService = inject(ErrorHandlerService);
  private readonly router = inject(Router);
  private readonly dashboardsService = inject(DashboardsService);
  private readonly formHandlerService = inject(FormHandlerService);

  form = new UntypedFormGroup({});
  formModel: CreateDashboardType = {
    name: '',
    isBlackTheme: false,
    isActive: true,
  };
  formFields$ = this.formHandlerService.createFormFieldsSubject();

  constructor() {
    // Initialize form fields
    this.setFormFields({});
  }

  private setFormFields(options?: { clientError?: ClientValidationErrorType }) {
    this.formHandlerService.updateFormFields(this.formFields$, {
      baseFields: DASHBOARD_FORMLY_FIELDS,
      clientError: options?.clientError,
      mapFields: mapFormlyTypes,
    });
  }

  onSubmit(model: CreateDashboardType) {
    this.setFormFields({});
    this.dashboardsService
      .create(model)
      .pipe(
        catchError(err =>
          this.errorHandlerService.catchAndProcessServerError({
            err,
            setFormlyFields: options => this.setFormFields(options),
          })
        ),
        first(),
        tap(dashboard => {
          if (dashboard && dashboard.id) {
            this.router.navigate([`/dashboards/${dashboard.id}`]);
          }
        })
      )
      .subscribe();
  }
}
