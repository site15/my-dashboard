import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, shareReplay, switchMap } from 'rxjs';

import { injectTrpcClient } from '../trpc-client';

@Component({
  selector: 'link-device-to-dashboard-page',
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
          <li>Link device</li>
        </ul>
      </nav>
    </h3>

    <hr />
    @if (qrForLinkDevice$ | async; as qrForLinkDevice) {
      <img src="{{ qrForLinkDevice }}" alt="QR Code" />
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
  readonly qrForLinkDevice$ = this.route.paramMap.pipe(
    switchMap(params =>
      this.trpc.dashboards.linkDevice.query({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        dashboardId: params.get('dashboardId')!,
      })
    ),
    map(result => result.qr),
    shareReplay(1)
  );
}
