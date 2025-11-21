import { Injectable } from '@angular/core';

import { DeviceLinkType } from '../../server/types/DashboardSchema';
import { injectTrpcClient } from '../trpc-client';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private trpc = injectTrpcClient();

  link(data: DeviceLinkType) {
    return this.trpc.device.link.mutate(data);
  }

  info(deviceId: string) {
    return this.trpc.device.info.query({ deviceId });
  }
}