import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { map, of, shareReplay, switchMap } from 'rxjs';

import { DashboardsService } from '../../../services/dashboards.service';

@Component({
  selector: 'dashboards-link-device-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormlyBootstrapModule, AsyncPipe, ReactiveFormsModule],
  template: `
    @if (dashboard$ | async; as dashboard) {
      <section>
        <h3>
          <nav aria-label="breadcrumb">
            <ul>
              <li><a href="/dashboards">Dashboards</a></li>
              <li>
                <a href="/dashboards/{{ dashboard.id }}">{{
                  dashboard.name
                }}</a>
              </li>
              <li>Link device</li>
            </ul>
          </nav>
        </h3>

        <hr />
        @if (qrForLinkDevice$ | async; as qrForLinkDevice) {
          <img src="{{ qrForLinkDevice }}" alt="QR Code" />
          <div class="grid">
            <a
              href="/dashboards/{{ dashboard.id }}"
              type="button"
              class="secondary"
              >Back</a
            >
          </div>
          <hr />
        }
      </section>
    }
  `,
})
export default class DashboardsLinkDevicePageComponent {
  private readonly dashboardsService = inject(DashboardsService);
  private readonly route = inject(ActivatedRoute);

  readonly dashboard$ = this.route.paramMap.pipe(
    map(params => params.get('dashboardId')),
    switchMap(dashboardId =>
      dashboardId ? this.dashboardsService.read(dashboardId) : of(null)
    ),
    shareReplay(1)
  );

  readonly qrForLinkDevice$ = this.route.paramMap.pipe(
    switchMap(params =>
      params.get('dashboardId') !== null
        ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.dashboardsService.generateQrCode(params.get('dashboardId')!)
        : of(null)
    ),
    map(result => result?.qr),
    shareReplay(1)
  );
}
