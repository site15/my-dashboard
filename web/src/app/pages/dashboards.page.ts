import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'dashboards-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<section>
    <h3>
      <nav aria-label="breadcrumb">
        <ul>
          <li>Dashboards</li>
        </ul>
      </nav>
    </h3>
    <a href="#">Create dashboard</a>

    <hr />

    <details name="example" open>
      <summary>Мой старый андроид <a href="/dashboards/1">Edit</a></summary>
      <p>ssdsd</p>
    </details>

    <hr />

    <details name="example">
      <summary>Телефон Руслана <a href="#">Edit</a></summary>
      <ul>
        <li>dsds</li>
        <li>.dsdsd.</li>
      </ul>
    </details>
  </section>`,
})
export default class DashboardsPageComponent {}
