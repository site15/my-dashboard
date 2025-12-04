import { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import { LucideAngularModule } from 'lucide-angular';
import { catchError, EMPTY, first, tap } from 'rxjs';

import { CreateDashboardType } from '../../../server/types/DashboardSchema';
import { ShowNavGuard } from '../../guards/nav.guard';
import {
  DASHBOARD_FORMLY_FIELDS,
  DashboardsService,
} from '../../services/dashboards.service';

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
    LucideAngularModule,
  ],
  template: `
    <h1 class="text-4xl font-extrabold text-gray-800 mb-2">
      <a href="/dashboards">Dashboards</a>: New dashboard
    </h1>
    <p class="text-xl text-gray-500 mb-8">Create a new dashboard.</p>

    <!-- Control Panel -->
    <div class="bg-white p-6 rounded-2xl long-shadow mb-8 space-y-4">
      <form [formGroup]="form" (ngSubmit)="onSubmit(model)" class="w-full">
        <formly-form
          [form]="form"
          [fields]="fields"
          [model]="model"
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
    </div>
  `,
})
export default class DashboardsNewPageComponent {
  private readonly router = inject(Router);
  private readonly dashboardsService = inject(DashboardsService);

  form = new UntypedFormGroup({});
  model: CreateDashboardType = {
    name: '',
    isBlackTheme: false,
    isActive: true,
  };
  fields: FormlyFieldConfig[] = DASHBOARD_FORMLY_FIELDS;

  onSubmit(model: CreateDashboardType) {
    this.dashboardsService
      .create(model)
      .pipe(
        first(), // Take only the first emission and complete
        tap((dashboard: { id: string }) => {
          if (dashboard && dashboard.id) {
            this.router.navigate([`/dashboards/${dashboard.id}`]);
          }
        }),
        catchError(error => {
          console.error('Dashboard creation failed:', error);
          return EMPTY;
        })
      )
      .subscribe();
  }
}