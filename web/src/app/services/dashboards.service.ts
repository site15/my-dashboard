import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

import {
  CreateDashboardType,
  UpdateDashboardType,
} from '../../server/types/DashboardSchema';
import { injectTrpcClient } from '../trpc-client';

export const DASHBOARD_FORMLY_FIELDS: FormlyFieldConfig[] = [
  {
    key: 'name',
    type: 'input',
    wrappers: ['flat-input-wrapper'],
    className: 'block text-lg font-medium text-gray-700 mb-2',
    props: {
      label: 'Name',
      placeholder: 'Enter name',
      // required: true,
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

  create(dashboard: CreateDashboardType) {
    return this.trpc.dashboards.create.mutate(
      Object.fromEntries(
        Object.entries(dashboard).filter(([, value]) => value !== '')
      ) as CreateDashboardType
    );
  }

  read(id: string) {
    return this.trpc.dashboards.read.query({ id });
  }

  update(dashboard: UpdateDashboardType) {
    return this.trpc.dashboards.update.mutate(
      Object.fromEntries(
        Object.entries(dashboard).filter(([, value]) => value !== '')
      ) as UpdateDashboardType
    );
  }

  delete(id: string) {
    return this.trpc.dashboards.delete.mutate({ id });
  }

  list() {
    return this.trpc.dashboards.list.query();
  }

  generateQrCode(dashboardId: string) {
    return this.trpc.dashboards.generateQrCode.query({ dashboardId });
  }
}
