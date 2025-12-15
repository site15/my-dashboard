import { inject } from '@angular/core';
import { createIcons, icons } from 'lucide';
import { forkJoin, map, mergeMap, of, switchMap, tap } from 'rxjs';

import { WidgetRender, WidgetType } from '../../server/types/WidgetSchema';
import { isSSR } from '../../server/utils/is-ssr';
import { setHabitItems } from '../../server/widgets/habits-widget.utils';
import {
  CreateWidgetsStateType,
  WIDGETS_FORMLY_FIELDS,
  WIDGETS_RENDERERS,
} from '../../server/widgets/widgets';
import { mapFormlyTypes } from '../formly/get-formly-type';
import { DashboardsService } from '../services/dashboards.service';
import { WidgetsService } from '../services/widgets.service';

export function mapToRenderHtml(
  staticMode = true,
  saveState?: (state: CreateWidgetsStateType, widget: WidgetType) => void
) {
  return mergeMap(
    (data: { render: WidgetRender<unknown>; widget: WidgetType } | null) =>
      data?.render?.render(data.widget, { static: staticMode, saveState }).pipe(
        tap(() =>
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              if (!isSSR) {
                createIcons({ icons });
              }
            });
          })
        )
      ) || of('')
  );
}

export function mapToRenderDataByDashboardIdAndWidgetId() {
  const dashboardsService = inject(DashboardsService);
  const widgetsService = inject(WidgetsService);

  return switchMap(({ dashboardId, widgetId }) =>
    dashboardId && widgetId
      ? forkJoin({
          dashboard: dashboardsService.read(dashboardId),
          widgetAndRender: widgetsService.read(widgetId).pipe(
            map(widget => {
              const model = widget.options;
              const fields = mapFormlyTypes(
                WIDGETS_FORMLY_FIELDS[widget.type] || []
              );
              const render = WIDGETS_RENDERERS[widget.type];
              setHabitItems(
                widget.id,
                widget.options?.items || [],
                widget.state?.history || []
              );
              return { render, widget, fields, model };
            })
          ),
        }).pipe(
          map(({ dashboard, widgetAndRender }) => ({
            dashboard,
            render: widgetAndRender.render,
            widget: widgetAndRender.widget,
            fields: widgetAndRender.fields,
            model: widgetAndRender.model,
          }))
        )
      : of(null)
  );
}
