import { Injectable } from '@angular/core';

import { LinkDeviceType } from '../../server/types/DashboardSchema';
import { injectTrpcClient } from '../trpc-client';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private trpc = injectTrpcClient();

  link(data: LinkDeviceType) {
    return this.trpc.device.link.mutate(data);
  }
}