import { Injectable } from '@angular/core';

import {
  CreateWidgetType,
  UpdateWidgetStateType,
  UpdateWidgetType,
} from '../../server/types/WidgetSchema';
import { injectTrpcPureClient } from '../trpc-pure-client';

@Injectable({
  providedIn: 'root',
})
export class WidgetsService {
  private trpc = injectTrpcPureClient();

  create(widget: CreateWidgetType) {
    return this.trpc.widgets.create.mutate(
      Object.fromEntries(
        Object.entries(widget).filter(([, value]) => value !== '')
      ) as CreateWidgetType
    );
  }

  read(id: string) {
    return this.trpc.widgets.read.query({ id });
  }

  update(widget: UpdateWidgetType) {
    return this.trpc.widgets.update.mutate(
      Object.fromEntries(
        Object.entries(widget).filter(([, value]) => value !== '')
      ) as UpdateWidgetType
    );
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
