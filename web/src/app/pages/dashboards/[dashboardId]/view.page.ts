import { RouteMeta } from '@analogjs/router';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { createIcons, icons } from 'lucide';
import {
  filter,
  first,
  forkJoin,
  map,
  mergeMap,
  of,
  shareReplay,
  switchMap,
} from 'rxjs';

import { isSSR } from '../../../../server/utils/is-ssr';
import { WIDGETS_RENDERERS } from '../../../../server/widgets/widgets';
import { NoSanitizePipe } from '../../../directives/no-sanitize.directive';
import { HideNavGuard } from '../../../guards/nav.guard';
import { StoreThemeInClientGuard } from '../../../guards/theme.guard';
import { DashboardsService } from '../../../services/dashboards.service';
import { ThemeService } from '../../../services/theme.service';
import { WidgetsService } from '../../../services/widgets.service';

export const routeMeta: RouteMeta = {
  canActivate: [HideNavGuard, StoreThemeInClientGuard],
};

@Component({
  selector: 'dashboards-view-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, NoSanitizePipe],
  template: `
    @if (dashboardAndWidgets$ | async; as dashboardAndWidgets) {
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 p-3"
      >
        @for (
          widget of (dashboardAndWidgets && dashboardAndWidgets.widgets) || [];
          track widget.id;
          let idx = $index
        ) {
          <div
            [innerHTML]="dashboardAndWidgets.htmls[idx] | noSanitize"
            class="w-full"
          ></div>
        }
      </div>
    }
  `,
})
export default class DashboardsViewPageComponent {
  private readonly dashboardsService = inject(DashboardsService);
  private readonly widgetsService = inject(WidgetsService);
  private readonly route = inject(ActivatedRoute);
  private readonly themeService = inject(ThemeService);

  widgetTypes = Object.keys(WIDGETS_RENDERERS);

  readonly dashboardAndWidgets$ = this.route.paramMap.pipe(
    map(params => params.get('dashboardId')),
    switchMap(dashboardId =>
      dashboardId
        ? forkJoin({
            dashboard: this.dashboardsService.read(dashboardId),
            widgets: this.widgetsService.list(dashboardId),
          })
        : of(null)
    ),
    mergeMap(result => {
      if (result?.dashboard.isBlackTheme) {
        this.themeService.setDark();
      } else {
        this.themeService.setLight();
      }
      // When dashboard and widgets data loads, render all widgets for preview
      if (result && result.widgets.length) {
        // Render each widget and store the HTML
        return forkJoin(
          result.widgets.map(widget => {
            const renderer = WIDGETS_RENDERERS[widget.type];
            if (renderer) {
              renderer.destroy?.(widget);
              return renderer
                .render(widget, {
                  static: false,
                  saveState: (state, widget) => {
                    this.widgetsService
                      .updateState({ id: widget.id, state })
                      .pipe(first())
                      .subscribe();
                  },
                })
                .pipe(
                  map(html => {
                    // html
                    requestAnimationFrame(() => {
                      requestAnimationFrame(() => {
                        if (!isSSR) {
                          createIcons({ icons });
                        }
                      });
                    });
                    return { html, widget };
                  })
                );
            }
            return of({ html: '', widget });
          })
        ).pipe(
          filter(widgetWithHtml => widgetWithHtml !== null),
          map(widgetWithHtml => ({
            ...result,
            widgets: widgetWithHtml.map(
              widgetWithHtml => widgetWithHtml!.widget
            ),
            htmls: widgetWithHtml.map(widgetWithHtml => widgetWithHtml!.html),
          }))
        );
      }
      return of({
        ...result,
        widgets: [],
        htmls: [],
      });
    }),
    shareReplay(1)
  );
}
