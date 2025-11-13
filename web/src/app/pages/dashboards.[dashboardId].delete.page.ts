import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

import { injectTrpcClient } from '../trpc-client';

@Component({
  selector: 'delete-dashboard-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe],
  template: `<section>
    <h3>
      <nav aria-label="breadcrumb">
        <ul>
          <li><a href="/dashboards">Dashboards</a></li>
          <li>
            <a href="/dashboards/{{ dashboardId$ | async }}"
              >Dashboard: {{ dashboardId$ | async }}</a
            >
          </li>
          <li>Delete</li>
        </ul>
      </nav>
    </h3>

    <hr />
    @if (dashboardId$ | async; as dashboardId) {
      Remove dashboard with id "{{ dashboardId }}" ?

      <div class="grid">
        <a href="/dashboards/{{ dashboardId }}" type="button" class="secondary"
          >No</a
        >
        <button type="submit">Yes</button>
      </div>
      <hr />
    }
  </section>`,
})
export default class LoginPageComponent {
  private readonly trpc = injectTrpcClient();
  private readonly route = inject(ActivatedRoute);

  readonly dashboardId$ = this.route.paramMap.pipe(
    map(params => params.get('dashboardId'))
  );
}
