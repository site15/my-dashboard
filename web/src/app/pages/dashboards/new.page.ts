import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import { tap, catchError, EMPTY, first } from 'rxjs';

import { CreateDashboardType } from '../../../server/types/DashboardSchema';
import { DashboardsService } from '../../services/dashboards.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { executeTrpcMutation } from '../../services/trpc-utils';

@Component({
  selector: 'dashboards-new-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormlyBootstrapModule, ReactiveFormsModule, FormlyForm],
  template: `
    <section>
      <h3>
        <nav aria-label="breadcrumb">
          <ul>
            <li><a href="/dashboards">Dashboards</a></li>
            <li>New dashboard</li>
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
          <button type="submit">Create</button>
        </div>
      </form>

      <hr />
    </section>
  `,
})
export default class DashboardsNewPageComponent {
  private readonly router = inject(Router);
  private readonly dashboardsService = inject(DashboardsService);
  private readonly errorHandler = inject(ErrorHandlerService);

  form = new UntypedFormGroup({});
  model: CreateDashboardType = { name: '', isBlackTheme: false };
  fields: FormlyFieldConfig[] = [
    {
      key: 'name',
      type: 'input',
      props: {
        label: 'Name',
        placeholder: 'Enter name',
        required: true,
        attributes: { 'aria-label': 'Name' },
      },
    },
    {
      key: 'isBlackTheme',
      type: 'checkbox',
      props: {
        label: 'Is black theme',
        attributes: { 'aria-label': 'Is black theme' },
      },
    },
  ];

  onSubmit(model: CreateDashboardType) {
    // Example of using the utility function with disabled error handling
    executeTrpcMutation(
      params => this.dashboardsService.create(params),
      model,
      {
        disableGlobalErrorHandling: false,
        customErrorMessage: 'Failed to create dashboard',
        errorHandler: this.errorHandler,
      }
    ).pipe(
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
    ).subscribe();
  }
}