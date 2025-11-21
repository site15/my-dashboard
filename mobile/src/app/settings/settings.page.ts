import { Component, inject } from '@angular/core';
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
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  qrCodeOutline,
  refreshOutline,
  saveOutline,
  unlinkOutline,
} from 'ionicons/icons';
import { firstValueFrom } from 'rxjs';
import { X_DEVICE_ID } from '../../../../web/src/server/constants';
import { DeviceInfoType } from '../../../../web/src/server/types/DashboardSchema';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { ErrorHandlerService } from '../services/error-handler.service';
import { injectTrpcClient, TrpcHeaders } from '../trpc-client';

@Component({
  selector: 'app-settings',
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-title> Settings </ion-title>
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
          <ion-title size="large">Settings</ion-title>
        </ion-toolbar>
      </ion-header>

      <app-explore-container name="Settings page">
        <div style="padding: 20px;">
          @if (dashboardInfo && deviceId) {
          <form (ngSubmit)="saveSettings()" #settingsForm="ngForm">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Dashboard Settings</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-item>
                  <ion-label position="stacked">Dashboard Name</ion-label>
                  <ion-input
                    [(ngModel)]="dashboardSettings.name"
                    [ngModelOptions]="{ standalone: true }"
                    name="name"
                    required
                  ></ion-input>
                </ion-item>

                <ion-item>
                  <ion-label>Dark Theme</ion-label>
                  <ion-toggle
                    [(ngModel)]="dashboardSettings.isBlackTheme"
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
                  <ion-item>
                    <ion-label>
                      <h3>Dashboard ID</h3>
                      <p>{{ dashboardInfo.id }}</p>
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
  ],
})
export class SettingsPage {
  private trpc = injectTrpcClient();
  private toastController = inject(ToastController);
  private alertController = inject(AlertController);
  private errorHandler = inject(ErrorHandlerService);

  dashboardInfo: DeviceInfoType | null = null;
  dashboardSettings = {
    name: '',
    isBlackTheme: false,
  };
  deviceId: string | null = null;
  saving = false;

  constructor() {
    addIcons({ refreshOutline, saveOutline, qrCodeOutline, unlinkOutline });
    // Initialize the error handler with the toast controller
    this.errorHandler.initialize(this.toastController);
  }

  async ionViewWillEnter() {
    await this.loadDashboardInfo();
  }

  async loadDashboardInfo() {
    // Get device ID from localStorage
    this.deviceId = localStorage.getItem('deviceId');

    if (!this.deviceId) {
      this.dashboardInfo = null;
      return;
    }

    try {
      // Set the device ID header for the request
      TrpcHeaders.set({ [X_DEVICE_ID]: this.deviceId });

      // Fetch dashboard info
      this.dashboardInfo = await firstValueFrom(this.trpc.device.info.query());

      // Update local settings
      this.dashboardSettings.name = this.dashboardInfo.name;
      this.dashboardSettings.isBlackTheme =
        this.dashboardInfo.isBlackTheme ?? false;
    } catch (err) {
      console.error('Error loading dashboard info:', err);
      // Use global error handler
      await this.errorHandler.handleError(err, 'Failed to load dashboard info');
      this.dashboardInfo = null;
    }
  }

  async saveSettings() {
    if (!this.dashboardInfo || !this.deviceId) {
      return;
    }

    this.saving = true;

    try {
      // Update dashboard settings
      await firstValueFrom(
        this.trpc.dashboards.update.mutate({
          id: this.dashboardInfo.id,
          name: this.dashboardSettings.name,
          isBlackTheme: this.dashboardSettings.isBlackTheme,
        })
      );

      // Show success message
      const toast = await this.toastController.create({
        message: 'Settings saved successfully',
        duration: 2000,
        color: 'success',
      });
      await toast.present();

      // Reload dashboard info to reflect changes
      await this.loadDashboardInfo();
    } catch (err) {
      console.error('Error saving settings:', err);
      // Use global error handler
      await this.errorHandler.handleError(err, 'Failed to save settings');
    } finally {
      this.saving = false;
    }
  }

  async unlinkDevice() {
    if (!this.dashboardInfo || !this.deviceId) {
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
              // Remove deviceId from localStorage
              localStorage.removeItem('deviceId');

              // Show success message
              const toast = await this.toastController.create({
                message: 'Device unlinked successfully',
                duration: 2000,
                color: 'success',
              });
              await toast.present();

              // Clear dashboard info
              this.dashboardInfo = null;
              this.deviceId = null;
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
