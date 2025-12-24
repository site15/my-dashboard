import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  AlertController,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSpinner,
  IonTitle,
  IonToggle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  qrCodeOutline,
  refreshOutline,
  saveOutline,
  unlinkOutline,
  bugOutline,
} from 'ionicons/icons';
import { BehaviorSubject } from 'rxjs';
import { X_DEVICE_ID } from '../../../../web/src/server/constants';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { DeviceService } from '../services/device.service';
import { ErrorHandlerService } from '../services/error-handler.service';
import { TrpcHeaders } from '../trpc-client';
import { TrpcPureHeaders } from '../trpc-pure-client';
import { activateSendLoggerMessageToServer } from '../remote-log';

@Component({
  selector: 'app-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let deviceSettings=(deviceSettings$ | async) || { name: '', isBlackTheme:
    false }; @let deviceId=(deviceId$ | async) || null; @let saving=(saving$ |
    async) || false; @let loading=(loading$ | async) || false;
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-title> Settings </ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="enableDebug()">
            <ion-icon name="bug-outline"></ion-icon>
          </ion-button>
          <ion-button (click)="loadDashboardInfo()" [disabled]="loading">
            <ion-icon name="refresh-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Settings</ion-title>
        </ion-toolbar>
      </ion-header>

      <app-explore-container name="Settings page">
        <div style="padding: 20px;">
          @if (loading) {
          <div class="flex flex-col items-center justify-center py-8">
            <ion-spinner></ion-spinner>
            <p class="mt-4 text-gray-600">Loading settings...</p>
          </div>
          } @else if (deviceSettings.name && deviceId) {
          <form (ngSubmit)="saveSettings()" #settingsForm="ngForm">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Dashboard Settings</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-item>
                  <ion-label position="stacked">Dashboard Name</ion-label>
                  <ion-input
                    [(ngModel)]="deviceSettings.name"
                    [ngModelOptions]="{ standalone: true }"
                    name="name"
                    required
                  ></ion-input>
                </ion-item>

                <ion-item>
                  <ion-label>Dark Theme</ion-label>
                  <ion-toggle
                    [(ngModel)]="deviceSettings.isBlackTheme"
                    [ngModelOptions]="{ standalone: true }"
                    name="isBlackTheme"
                  ></ion-toggle>
                </ion-item>

                <ion-button
                  type="submit"
                  [disabled]="!settingsForm.form.valid || saving"
                  expand="block"
                >
                  @if (saving) {
                  <ion-spinner slot="start"></ion-spinner>
                  Save Settings } @else {
                  <ion-icon name="save-outline" slot="start"></ion-icon>
                  Save Settings }
                </ion-button>
              </ion-card-content>
            </ion-card>

            <ion-card>
              <ion-card-header>
                <ion-card-title>Device Information</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-list>
                  <ion-item>
                    <ion-label>
                      <h3>Device ID</h3>
                      <p>{{ deviceId }}</p>
                    </ion-label>
                  </ion-item>
                </ion-list>

                <ion-button
                  color="danger"
                  fill="outline"
                  expand="block"
                  (click)="unlinkDevice()"
                >
                  <ion-icon name="unlink-outline" slot="start"></ion-icon>
                  Unlink Device
                </ion-button>
              </ion-card-content>
            </ion-card>
          </form>
          } @else {
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
          }
        </div>
      </app-explore-container>
    </ion-content>
  `,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonToggle,
    IonButton,
    IonIcon,
    IonList,
    IonButtons,
    IonSpinner,
    FormsModule,
    RouterLink,
    ExploreContainerComponent,
    AsyncPipe,
  ],
})
export class SettingsPage {
  private toastController = inject(ToastController);
  private alertController = inject(AlertController);
  private errorHandler = inject(ErrorHandlerService);
  private readonly deviceService = inject(DeviceService);

  deviceSettings$ = new BehaviorSubject({
    name: '',
    isBlackTheme: false,
  });
  deviceId$ = new BehaviorSubject<string | null>(null);
  saving$ = new BehaviorSubject(false);
  loading$ = new BehaviorSubject(false);

  constructor() {
    addIcons({
      refreshOutline,
      saveOutline,
      qrCodeOutline,
      unlinkOutline,
      bugOutline,
    });
    // Initialize the error handler with the toast controller
    this.errorHandler.initialize(this.toastController);
  }

  async ionViewWillEnter() {
    await this.loadDashboardInfo();
  }

  enableDebug() {
    activateSendLoggerMessageToServer();
    this.toastController
      .create({
        message: 'Debug mode enabled',
        duration: 2000,
        color: 'success',
      })
      .then((toast) => toast.present());
  }

  async loadDashboardInfo() {
    // Set loading state to true when starting to load data
    this.loading$.next(true);

    try {
      // Get device ID from localStorage
      this.deviceId$.next(localStorage.getItem('deviceId'));

      if (!this.deviceId$.value) {
        this.deviceSettings$.next({
          name: '',
          isBlackTheme: false,
        });
        return;
      }

      // Set the device ID header for the request
      TrpcHeaders.set({ [X_DEVICE_ID]: this.deviceId$.value });
      TrpcPureHeaders.set({ [X_DEVICE_ID]: this.deviceId$.value });

      // Fetch dashboard info
      const deviceSettings = await this.deviceService.info();

      // Update local settings
      this.deviceSettings$.next({
        name: deviceSettings.name,
        isBlackTheme: deviceSettings.isBlackTheme === true,
      });
    } catch (err) {
      console.error('Error loading dashboard info:', err);
      // Use global error handler
      await this.errorHandler.handleError(err, 'Failed to load dashboard info');
      this.deviceSettings$.next({
        name: '',
        isBlackTheme: false,
      });
    } finally {
      // Set loading state to false when operation completes
      this.loading$.next(false);
    }
  }

  async saveSettings() {
    if (!this.deviceSettings$.value.name || !this.deviceId$.value) {
      return;
    }

    this.saving$.next(true);

    try {
      // Update dashboard settings
      await this.deviceService.saveSettings({
        isBlackTheme: this.deviceSettings$.value.isBlackTheme,
      });

      // Show success message
      const toast = await this.toastController.create({
        message: 'Settings saved successfully',
        duration: 2000,
        color: 'success',
      });
      await toast.present();
    } catch (err) {
      console.error('Error saving settings:', err);
      // Use global error handler
      await this.errorHandler.handleError(err, 'Failed to save settings');
    } finally {
      this.saving$.next(false);
    }
  }

  async unlinkDevice() {
    if (!this.deviceSettings$.value || !this.deviceId$.value) {
      return;
    }

    try {
      // Create and present Ionic alert instead of using native confirm
      const alert = await this.alertController.create({
        header: 'Confirm Unlink',
        message:
          'Are you sure you want to unlink this device from the dashboard?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Unlink',
            role: 'destructive',
            handler: async () => {
              await this.deviceService.unlink();

              TrpcHeaders.set({});
              TrpcPureHeaders.set({});

              // Show success message
              const toast = await this.toastController.create({
                message: 'Device unlinked successfully',
                duration: 2000,
                color: 'success',
              });
              await toast.present();

              // Clear dashboard info
              this.deviceSettings$.next({
                name: '',
                isBlackTheme: false,
              });
              this.deviceId$.next(null);
            },
          },
        ],
      });
      await alert.present();
    } catch (err) {
      console.error('Error unlinking device:', err);
      // Use global error handler
      await this.errorHandler.handleError(err, 'Failed to unlink device');
    }
  }
}
