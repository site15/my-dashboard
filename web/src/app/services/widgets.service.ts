import { Injectable } from '@angular/core';

import {
  CreateWidgetType,
  UpdateWidgetStateType,
  UpdateWidgetType,
} from '../../server/types/WidgetSchema';
import { injectTrpcClient } from '../trpc-client';

@Injectable({
  providedIn: 'root',
})
export class WidgetsService {
  private trpc = injectTrpcClient();

  create(widget: CreateWidgetType) {
    return this.trpc.widgets.create.mutate(widget);
  }

  read(id: string) {
    return this.trpc.widgets.read.query({ id });
  }

  update(widget: UpdateWidgetType) {
    return this.trpc.widgets.update.mutate(widget);
  }

  delete(id: string) {
    return this.trpc.widgets.delete.mutate({ id });
  }

  list(dashboardId: string) {
    return this.trpc.widgets.list.query({ dashboardId });
  }

  updateState(widget: UpdateWidgetStateType) {
    return this.trpc.widgets.updateState.mutate(widget);
  }
}
