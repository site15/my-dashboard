import { RouteMeta } from '@analogjs/router';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ShowNavGuard } from '../../guards/nav.guard';
import { DashboardsService } from '../../services/dashboards.service';

export const routeMeta: RouteMeta = {
  canActivate: [ShowNavGuard],
};

@Component({
  selector: 'dashboards-list-page',
  standalone: true,
  imports: [AsyncPipe, JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<section class="pico">
    <h3>
      <nav aria-label="breadcrumb">
        <ul>
          <li>Dashboards</li>
        </ul>
      </nav>
    </h3>
    <a href="/dashboards/new">Create dashboard</a>

    <hr />
    @for (dashboard of dashboards$ | async; track dashboard.id) {
      <details name="dashboard" open>
        <summary>
          <hgroup>
            <h5>{{ dashboard.name }}</h5>
            <p>
              <a href="/dashboards/{{ dashboard.id }}">Edit</a>
            </p>
          </hgroup>
        </summary>
        <p>{{ dashboard | json }}</p>
      </details>
      <hr />
    } @empty {
      <details name="dashboard" open>
        <summary>There are no dashboards</summary>
      </details>
      <hr />
    }
  </section>`,
})
export default class DashboardsListPageComponent {
  private readonly dashboardsService = inject(DashboardsService);

  readonly dashboards$ = this.dashboardsService.list();
}
