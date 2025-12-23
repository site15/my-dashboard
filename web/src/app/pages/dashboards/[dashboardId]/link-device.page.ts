import { RouteMeta } from '@analogjs/router';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { LucideAngularModule } from 'lucide-angular';
import { BehaviorSubject, map, of, shareReplay, switchMap } from 'rxjs';

import { ShowNavGuard } from '../../../guards/nav.guard';
import { DashboardsService } from '../../../services/dashboards.service';

export const routeMeta: RouteMeta = {
  canActivate: [ShowNavGuard],
};

@Component({
  selector: 'dashboards-link-device-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormlyBootstrapModule,
    AsyncPipe,
    ReactiveFormsModule,
    LucideAngularModule,
  ],
  template: `
    @if (dashboard$ | async; as dashboard) {
      <h1 class="text-4xl font-extrabold text-gray-800 mb-2">
        Link Device to "{{ dashboard.name }}"
      </h1>

      <p class="text-xl text-gray-500 mb-8">
        <a
          href="/dashboards/{{ dashboard.id }}"
          class="text-gray-500 hover:text-pastel-blue transition-colors mb-10 mt-2 flex items-center"
        >
          <i-lucide name="arrow-left" class="w-6 h-6 mr-0 lg:mr-2"></i-lucide>
          <span class="hidden lg:inline text-lg font-medium"
            >Back to Dashboard</span
          >
        </a>
        Scan the QR code with your mobile device to link it to this dashboard.
      </p>

      <!-- QR Code Panel -->
      <div class="bg-white p-6 rounded-2xl long-shadow mb-8 space-y-4">
        <div class="flex flex-col items-center justify-center py-8">
          @if (qrForLinkDevice$ | async; as qrForLinkDevice) {
            <div
              class="mb-6 p-4 bg-white rounded-xl border border-gray-200 inline-block"
            >
              <img
                src="{{ qrForLinkDevice.qr }}"
                alt="QR Code"
                class="w-64 h-64"
              />

              <div class="text-center mt-4">
                Code: {{ qrForLinkDevice.code }}
              </div>
            </div>
            <p class="text-gray-600 text-center max-w-md mb-8">
              Open the mobile app and scan this QR code to link your device to
              the
              <span class="font-bold">{{ dashboard.name }}</span> dashboard.
            </p>

            <!-- Regenerate QR Code Button -->
            <button
              (click)="regenerateQrCode()"
              class="flex items-center text-lg font-bold py-3 px-6 rounded-xl text-white bg-pastel-blue transition-all duration-300 transform hover:scale-[1.02] flat-btn-shadow"
            >
              <i-lucide name="refresh-cw" class="w-5 h-5 mr-2"></i-lucide>
              Regenerate QR Code
            </button>
          }
        </div>
      </div>
    }
  `,
})
export default class DashboardsLinkDevicePageComponent {
  private readonly dashboardsService = inject(DashboardsService);
  private readonly route = inject(ActivatedRoute);

  // Use BehaviorSubject to allow manual QR code regeneration
  private qrCodeSubject = new BehaviorSubject<{
    code: string;
    qr: string;
  } | null>(null);
  readonly qrForLinkDevice$ = this.qrCodeSubject.asObservable();

  readonly dashboard$ = this.route.paramMap.pipe(
    map(params => params.get('dashboardId')),
    switchMap(dashboardId =>
      dashboardId ? this.dashboardsService.read(dashboardId) : of(null)
    ),
    shareReplay(1)
  );

  constructor() {
    // Load initial QR code when component initializes
    this.loadInitialQrCode();
  }

  private loadInitialQrCode() {
    this.route.paramMap
      .pipe(
        switchMap(params =>
          params.get('dashboardId') !== null
            ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              this.dashboardsService.generateQrCode(params.get('dashboardId')!)
            : of(null)
        )
      )
      .subscribe(result => {
        this.qrCodeSubject.next(result || null);
      });
  }

  regenerateQrCode() {
    this.route.paramMap
      .pipe(
        switchMap(params =>
          params.get('dashboardId') !== null
            ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              this.dashboardsService.generateQrCode(params.get('dashboardId')!)
            : of(null)
        )
      )
      .subscribe(result => {
        this.qrCodeSubject.next(result || null);
      });
  }
}
