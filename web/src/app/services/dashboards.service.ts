import { Injectable } from '@angular/core';

import {
  CreateDashboardType,
  UpdateDashboardType,
  LinkDeviceType,
} from '../../server/types/DashboardSchema';
import { injectTrpcClient } from '../trpc-client';

@Injectable({
  providedIn: 'root',
})
export class DashboardsService {
  private trpc = injectTrpcClient();

  create(dashboard: CreateDashboardType) {
    return this.trpc.dashboards.create.mutate(dashboard);
  }

  read(id: string) {
    return this.trpc.dashboards.read.query({ id });
  }

  update(dashboard: UpdateDashboardType) {
    return this.trpc.dashboards.update.mutate(dashboard);
  }

  delete(id: string) {
    return this.trpc.dashboards.delete.mutate({ id });
  }

  list() {
    return this.trpc.dashboards.list.query();
  }

  linkDevice(data: LinkDeviceType) {
    return this.trpc.dashboards.linkDevice.mutate(data);
  }

  generateQrCode(dashboardId: string) {
    return this.trpc.dashboards.generateQrCode.query({ dashboardId });
  }
}
