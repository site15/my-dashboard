import { Injectable, inject } from '@angular/core';

import {
  CreateWidgetType,
  UpdateWidgetStateType,
  UpdateWidgetType,
} from '../../server/types/WidgetSchema';
import { injectTrpcClient } from '../trpc-client';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class WidgetsService {
  private trpc = injectTrpcClient();
  private errorHandler = inject(ErrorHandlerService);

  create(widget: CreateWidgetType) {
    return this.errorHandler.withErrorHandling(
      this.trpc.widgets.create.mutate(widget),
      'Failed to create widget'
    );
  }

  read(id: string) {
    return this.errorHandler.withErrorHandling(
      this.trpc.widgets.read.query({ id }),
      'Failed to load widget'
    );
  }

  update(widget: UpdateWidgetType) {
    return this.errorHandler.withErrorHandling(
      this.trpc.widgets.update.mutate(widget),
      'Failed to update widget'
    );
  }

  delete(id: string) {
    return this.errorHandler.withErrorHandling(
      this.trpc.widgets.delete.mutate({ id }),
      'Failed to delete widget'
    );
  }

  list(dashboardId: string) {
    return this.errorHandler.withErrorHandling(
      this.trpc.widgets.list.query({ dashboardId }),
      'Failed to load widgets'
    );
  }

  updateState(widget: UpdateWidgetStateType) {
    return this.errorHandler.withErrorHandling(
      this.trpc.widgets.updateState.mutate(widget),
      'Failed to update widget state'
    );
  }
}