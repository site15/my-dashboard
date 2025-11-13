import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'one-dashboard-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe],
  template: `
    @if (dashboardId$ | async; as dashboardId) {
      <section>
        <h3>
          <nav aria-label="breadcrumb">
            <ul>
              <li><a href="/dashboards">Dashboards</a></li>
              <li>Dashboard: {{ dashboardId }}</li>
            </ul>
          </nav>
        </h3>
        <hr />

        <form>
          <input
            type="text"
            name="name"
            placeholder="Name"
            aria-label="Name"
            required
          />
          <div class="grid">
            <a
              href="/dashboards/{{ dashboardId }}/delete"
              type="button"
              class="secondary"
              >Remove</a
            >
            <a
              href="/dashboards/{{ dashboardId }}/link-device"
              type="button"
              class="contrast"
              >Link device</a
            >
            <button type="submit">Save</button>
          </div>
        </form>

        <hr />
      </section>

      <h4>Widgets (2)</h4>

      <div class="grid">
        <a href="/dashboards/{{ dashboardId }}/widgets/add-clock">Add clock</a>
        <a href="/dashboards/{{ dashboardId }}/widgets/add-calendar"
          >Add calendar</a
        >
      </div>
      <hr />

      <details open>
        <summary>
          Clock <a href="/dashboards/{{ dashboardId }}/widgets/1">Edit</a>
        </summary>
        <p>ssdsd</p>
      </details>

      <hr />

      <details open>
        <summary>
          Calendar <a href="/dashboards/{{ dashboardId }}/widgets/2">Edit</a>
        </summary>
        <p>ssdsd</p>
      </details>
    }
  `,
})
export default class LoginPageComponent {
  private readonly route = inject(ActivatedRoute);

  readonly dashboardId$ = this.route.paramMap.pipe(
    map(params => params.get('dashboardId'))
  );
}
