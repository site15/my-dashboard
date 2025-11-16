import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { DashboardsService } from '../../services/dashboards.service';

@Component({
  selector: 'dashboards-list-page',
  standalone: true,
  imports: [AsyncPipe, JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<section>
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
          {{ dashboard.name }}<br />
          <a href="/dashboards/{{ dashboard.id }}">Edit</a>
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
export default class DashboardsPageComponent {
  private readonly dashboardsService = inject(DashboardsService);

  readonly dashboards$ = this.dashboardsService.list();
}
