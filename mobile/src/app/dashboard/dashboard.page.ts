import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonSpinner,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { qrCodeOutline, refreshOutline } from 'ionicons/icons';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { injectTrpcClient, TrpcHeaders } from '../trpc-client';
// Import types from the backend Zod schemas
import { createIcons, icons } from 'lucide';
import {
  BehaviorSubject,
  filter,
  first,
  forkJoin,
  map,
  mergeMap,
  of,
  shareReplay,
} from 'rxjs';
import { X_DEVICE_ID } from '../../../../web/src/server/constants';
import { DeviceInfoType } from '../../../../web/src/server/types/DeviceSchema';
import { WIDGETS_RENDERERS } from '../../../../web/src/server/widgets/widgets';
import { NoSanitizePipe } from '../pipes/no-sanitize.directive';
import { DeviceService } from '../services/device.service';
import { ErrorHandlerService } from '../services/error-handler.service';
import { TrpcPureHeaders } from '../trpc-pure-client';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let dashboardAndWidgets=(dashboardAndWidgets$ | async)||null; @let
    isLoading=(isLoading$ | async)||null; @if (dashboardAndWidgets?.id) {
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 p-3"
    >
      @for (widget of dashboardAndWidgets?.widgets; track widget.id; let idx =
      $index) {
      <div
        [innerHTML]="dashboardAndWidgets?.htmls?.[idx] | noSanitize"
        class="w-full"
      ></div>
      }
    </div>
    } @else {

    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-title>
          {{ 'Dashboard' }}
        </ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="loadDashboardInfo()">
            <ion-icon name="refresh-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ 'Dashboard' }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <app-explore-container name="Dashboard page">
        @if (isLoading) {
        <div style="padding: 20px; text-align: center;">
          <div
            style="display: flex; flex-direction: column; align-items: center; gap: 16px;"
          >
            <ion-spinner></ion-spinner>
            <p>Loading...</p>
          </div>
        </div>
        } @else {
        <div style="padding: 20px;">
          <ion-card>
            <ion-card-content>
              <p>No dashboard linked to this device.</p>
              <ion-button
                routerLink="/tabs/qr-code"
                fill="clear"
                expand="block"
              >
                <ion-icon name="qr-code-outline" slot="start"></ion-icon>
                Scan QR Code to Link Device
              </ion-button>
            </ion-card-content>
          </ion-card>
        </div>

        }</app-explore-container
      >
    </ion-content>
    }
  `,
  imports: [
    IonSpinner,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonButton,
    IonIcon,
    IonButtons,
    RouterLink,
    ExploreContainerComponent,
    AsyncPipe,
    NoSanitizePipe,
    JsonPipe,
  ],
})
export class DashboardPage {
  private readonly trpc = injectTrpcClient();
  private readonly toastController = inject(ToastController);
  private readonly errorHandler = inject(ErrorHandlerService);
  private readonly deviceService = inject(DeviceService);

  dashboardInfo$ = new BehaviorSubject<DeviceInfoType | null>(null);
  isLoading$ = new BehaviorSubject<boolean>(false);
  error$ = new BehaviorSubject<string | null>(null);
  readonly dashboardAndWidgets$ = this.dashboardInfo$.asObservable().pipe(
    mergeMap((dashboardInfo) => {
      // When dashboard and widgets data loads, render all widgets for preview
      if (dashboardInfo && dashboardInfo.widgets.length) {
        // Render each widget and store the HTML
        return forkJoin(
          dashboardInfo.widgets.map((widget) => {
            const renderer = WIDGETS_RENDERERS[widget.type];
            if (renderer) {
              return renderer
                .render(widget as any, {
                  static: false,
                  saveState: (state, widget) => {
                    this.trpc.widgets.updateState
                      .mutate({ id: widget.id, state })
                      .pipe(first())
                      .subscribe();
                  },
                })
                .pipe(
                  map((html) => {
                    // html
                    requestAnimationFrame(() => {
                      requestAnimationFrame(() => {
                        createIcons({ icons });
                      });
                    });
                    return { html, widget };
                  })
                );
            }
            return of({ html: '', widget });
          })
        ).pipe(
          filter((widgetWithHtml) => widgetWithHtml !== null),
          map((widgetWithHtml) => ({
            ...dashboardInfo,
            widgets: widgetWithHtml.map(
              (widgetWithHtml) => widgetWithHtml!.widget
            ),
            htmls: widgetWithHtml.map((widgetWithHtml) => widgetWithHtml!.html),
          }))
        );
      }
      return of({
        ...dashboardInfo,
        widgets: [],
        htmls: [],
      });
    }),
    shareReplay(1)
  );

  constructor() {
    addIcons({ refreshOutline, qrCodeOutline });
    // Initialize the error handler with the toast controller
    this.errorHandler.initialize(this.toastController);
  }

  ionViewWillEnter() {
    // Refresh data every time the view is about to enter
    this.loadDashboardInfo();
  }

  async loadDashboardInfo() {
    // Get deviceId from localStorage
    const deviceId = localStorage.getItem('deviceId');

    if (!deviceId) {
      this.dashboardInfo$.next(null);
      this.error$.next('No device ID found. Please scan a QR code first.');
      return;
    }

    this.isLoading$.next(true);
    this.error$.next(null);

    TrpcHeaders.set({ [X_DEVICE_ID]: deviceId });
    TrpcPureHeaders.set({ [X_DEVICE_ID]: deviceId });

    try {
      // Fetch dashboard info using deviceId
      // Using a simple approach to avoid type issues
      const response = await this.deviceService.info();
      this.dashboardInfo$.next(response);
    } catch (err) {
      this.dashboardInfo$.next(null);
      console.error('Error fetching dashboard info:', err);
      this.error$.next('Failed to load dashboard information.');
      // Use global error handler
      await this.errorHandler.handleError(
        err,
        'Failed to load dashboard information'
      );
    } finally {
      this.isLoading$.next(false);
    }
  }

  widgetTypes = Object.keys(WIDGETS_RENDERERS);
}
