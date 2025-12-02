import { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ShowNavGuard } from '../guards/nav.guard';

export const routeMeta: RouteMeta = {
  canActivate: [ShowNavGuard],
};

@Component({
  selector: 'home-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<section class="pico">
    <h3>
      <nav aria-label="breadcrumb">
        <ul>
          <li>Project Goal</li>
        </ul>
      </nav>
    </h3>
    <p>
      Creating a dashboard management system for displaying information on old
      Android phones.
    </p>

    <p>
      Users create dashboards through a web application, add widgets, and bind
      phones via QR code.
    </p>

    <p>
      The phone receives data through an API and displays widgets in real-time.
    </p>
    <hr />
  </section>`,
})
export default class HomePageComponent {}
