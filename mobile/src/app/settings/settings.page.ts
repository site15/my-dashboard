import { Component, OnInit, inject } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
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
  IonNote,
  IonButtons,
  ToastController,
  AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  refreshOutline,
  saveOutline,
  qrCodeOutline,
  unlinkOutline,
} from 'ionicons/icons';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { injectTrpcClient, TrpcHeaders } from '../trpc-client';
import { firstValueFrom } from 'rxjs';
import { X_DEVICE_ID } from '../../../../web/src/server/constants';
import { DeviceInfoType } from '../../../../web/src/server/types/DashboardSchema';

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
          @if (loading) {
          <p>Loading dashboard settings...</p>
          } @else if (error) {
          <ion-card>
            <ion-card-content>
              <p>Error: {{ error }}</p>
              <ion-button
                (click)="loadDashboardInfo()"
                fill="clear"
                expand="block"
              >
                <ion-icon name="refresh-outline" slot="start"></ion-icon>
                Retry
              </ion-button>
            </ion-card-content>
          </ion-card>
          } @else if (dashboardInfo) {
          <form (ngSubmit)="saveSettings()" #settingsForm="ngForm">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Dashboard Settings</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-list>
                  <ion-item>
                    <ion-label position="stacked">Dashboard Name</ion-label>
                    <ion-input
                      [(ngModel)]="dashboardSettings.name"
                      name="name"
                      type="text"
                      placeholder="Enter dashboard name"
                      readonly
                    ></ion-input>
                  </ion-item>

                  <ion-item>
                    <ion-label>Dark Theme</ion-label>
                    <ion-toggle
                      [(ngModel)]="dashboardSettings.isBlackTheme"
                      name="isBlackTheme"
                      slot="end"
                    >
                    </ion-toggle>
                  </ion-item>
                </ion-list>

                <ion-button expand="block" type="submit" [disabled]="saving">
                  <ion-icon name="save-outline" slot="start"></ion-icon>
                  {{ saving ? 'Saving...' : 'Save Settings' }}
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
                    <ion-label>Device ID</ion-label>
                    <ion-input
                      [ngModel]="deviceId"
                      type="text"
                      readonly
                    ></ion-input>
                  </ion-item>

                  <ion-item>
                    <ion-label>Dashboard ID</ion-label>
                    <ion-input
                      [ngModel]="dashboardInfo.id"
                      type="text"
                      readonly
                    ></ion-input>
                  </ion-item>

                  <ion-item>
                    <ion-label>Widget Count</ion-label>
                    <ion-input
                      [ngModel]="dashboardInfo.widgets.length"
                      type="text"
                      readonly
                    ></ion-input>
                  </ion-item>
                </ion-list>
              </ion-card-content>
            </ion-card>

            <ion-card>
              <ion-card-header>
                <ion-card-title>Actions</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-button
                  expand="block"
                  color="danger"
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
    IonNote,
    IonButtons,
    FormsModule,
    RouterLink,
    ExploreContainerComponent,
    JsonPipe,
  ],
})
export class SettingsPage {
  private trpc = injectTrpcClient();
  private toastController = inject(ToastController);
  private alertController = inject(AlertController);

  dashboardInfo: DeviceInfoType | null = null;
  dashboardSettings = {
    name: '',
    isBlackTheme: false,
  };
  deviceId: string | null = null;
  loading = false;
  saving = false;
  error: string | null = null;

  constructor() {
    addIcons({ refreshOutline, saveOutline, qrCodeOutline, unlinkOutline });
  }

  async ionViewWillEnter() {
    // Refresh data every time the view is about to enter
    await this.loadDashboardInfo();
  }

  async loadDashboardInfo() {
    // Get deviceId from localStorage
    this.deviceId = localStorage.getItem('deviceId');

    if (!this.deviceId) {
      this.error = 'No device ID found. Please scan a QR code first.';
      this.dashboardInfo = null;
      return;
    }

    this.loading = true;
    this.error = null;

    TrpcHeaders.set({ [X_DEVICE_ID]: this.deviceId });

    try {
      // Fetch dashboard info using deviceId
      const response = await firstValueFrom(this.trpc.device.info.query());
      this.dashboardInfo = response;

      // Initialize settings form
      this.dashboardSettings.name = response.name;
      this.dashboardSettings.isBlackTheme = response.isBlackTheme || false;
    } catch (err) {
      console.error('Error fetching dashboard info:', err);
      this.error = 'Failed to load dashboard information.';
      this.dashboardInfo = null;
    } finally {
      this.loading = false;
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
      const toast = await this.toastController.create({
        message: 'Failed to save settings',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
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
      const toast = await this.toastController.create({
        message: 'Failed to unlink device',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
  }
}
