import { inject } from '@angular/core';
import { forkJoin, map, mergeMap, of, switchMap } from 'rxjs';

import { WidgetRender, WidgetType } from '../../server/types/WidgetSchema';
import {
  WIDGETS_FORMLY_FIELDS,
  WIDGETS_RENDERERS,
} from '../../server/widgets/widgets';
import { mapFormlyTypes } from '../formly/get-formly-type';
import { DashboardsService } from '../services/dashboards.service';
import { WidgetsService } from '../services/widgets.service';

export function mapToRenderHtml(staticMode = true) {
  return mergeMap(
    (data: { render: WidgetRender<unknown>; widget: WidgetType } | null) =>
      data?.render?.render(data.widget, { static: staticMode }) || of('')
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
