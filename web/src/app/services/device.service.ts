import { Injectable, inject } from '@angular/core';

import { DeviceLinkType } from '../../server/types/DeviceSchema';
import { injectTrpcClient } from '../trpc-client';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private trpc = injectTrpcClient();
  private errorHandler = inject(ErrorHandlerService);

  link(data: DeviceLinkType) {
    return this.errorHandler.withErrorHandling(
      this.trpc.device.link.mutate(data),
      'Failed to link device'
    );
  }

  info() {
    return this.errorHandler.withErrorHandling(
      this.trpc.device.info.query(),
      'Failed to get device info'
    );
  }
}
