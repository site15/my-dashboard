import { Injectable, inject } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

import {
  CreateDashboardType,
  UpdateDashboardType,
} from '../../server/types/DashboardSchema';
import { injectTrpcClient } from '../trpc-client';
import { ErrorHandlerService } from './error-handler.service';

export const DASHBOARD_FORMLY_FIELDS: FormlyFieldConfig[] = [
  {
    key: 'name',
    type: 'input',
    className: 'block text-lg font-medium text-gray-700 mb-2',
    props: {
      label: 'Name',
      placeholder: 'Enter name',
      required: true,
      attributes: {
        'aria-label': 'Name',
        class: 'flat-input',
      },
    },
  },
  {
    key: 'isBlackTheme',
    type: 'checkbox',
    className: 'block text-lg font-medium text-gray-700 mb-2',
    props: {
      label: 'Is black theme',
      attributes: { 'aria-label': 'Is black theme', class: 'flat-checkbox' },
      className: 'flat-checkbox',
    },
  },
  {
    key: 'isActive',
    type: 'checkbox',
    className: 'block text-lg font-medium text-gray-700 mb-2',
    props: {
      label: 'Is active',
      attributes: { 'aria-label': 'Is active', class: 'flat-checkbox' },
      className: 'flat-checkbox',
    },
  },
];

@Injectable({
  providedIn: 'root',
})
export class DashboardsService {
  private trpc = injectTrpcClient();
  private errorHandler = inject(ErrorHandlerService);

  create(dashboard: CreateDashboardType) {
    return this.errorHandler.withErrorHandling(
      this.trpc.dashboards.create.mutate(dashboard),
      'Failed to create dashboard'
    );
  }

  read(id: string) {
    return this.errorHandler.withErrorHandling(
      this.trpc.dashboards.read.query({ id }),
      'Failed to load dashboard'
    );
  }

  update(dashboard: UpdateDashboardType) {
    return this.errorHandler.withErrorHandling(
      this.trpc.dashboards.update.mutate(dashboard),
      'Failed to update dashboard'
    );
  }

  delete(id: string) {
    return this.errorHandler.withErrorHandling(
      this.trpc.dashboards.delete.mutate({ id }),
      'Failed to delete dashboard'
    );
  }

  list() {
    return this.errorHandler.withErrorHandling(
      this.trpc.dashboards.list.query(),
      'Failed to load dashboards'
    );
  }

  generateQrCode(dashboardId: string) {
    return this.errorHandler.withErrorHandling(
      this.trpc.dashboards.generateQrCode.query({ dashboardId }),
      'Failed to generate QR code'
    );
  }
}