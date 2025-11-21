import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { qrCodeOutline, refreshOutline } from 'ionicons/icons';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { injectTrpcClient, TrpcHeaders } from '../trpc-client';
// Import types from the backend Zod schemas
import { firstValueFrom } from 'rxjs';
import { X_DEVICE_ID } from '../../../../web/src/server/constants';
import { DeviceInfoType } from '../../../../web/src/server/types/DashboardSchema';

@Component({
  selector: 'app-dashboard',
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-title>
          {{ dashboardInfo?.name || 'Dashboard' }}
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
          <ion-title size="large">{{
            dashboardInfo?.name || 'Dashboard'
          }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <app-explore-container name="Dashboard page">
        <div style="padding: 20px;">
          @if (dashboardInfo) {
          <div>
            <h2>Widgets</h2>
            @for (widget of dashboardInfo.widgets; track widget.id) {
            <ion-card>
              <ion-card-header>
                <ion-card-title
                  >Widget {{ widget.id.substring(0, 8) }}</ion-card-title
                >
              </ion-card-header>
              <ion-card-content>
                <p><strong>Options:</strong> {{ widget.options | json }}</p>
                <p><strong>State:</strong> {{ widget.state | json }}</p>
                @if (widget.columnIndex !== null) {
                <p>Column: {{ widget.columnIndex }}</p>
                } @if (widget.rowIndex !== null) {
                <p>Row: {{ widget.rowIndex }}</p>
                }
              </ion-card-content>
            </ion-card>
            }
          </div>
          } @else if (loading) {
          <p>Loading dashboard information...</p>
          } @else if (error) {
          <p>Error: {{ error }}</p>
          <ion-button (click)="loadDashboardInfo()" fill="clear">
            <ion-icon name="refresh-outline" slot="start"></ion-icon>
            Retry
          </ion-button>
          } @else {
          <p>
            No dashboard information available. Please scan a QR code to link a
            device.
          </p>
          <ion-button routerLink="/tabs/qr-code" fill="clear">
            <ion-icon name="qr-code-outline" slot="start"></ion-icon>
            Scan QR Code
          </ion-button>
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
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonButton,
    IonIcon,
    IonButtons,
    RouterLink,
    ExploreContainerComponent,
    JsonPipe,
  ],
})
export class DashboardPage {
  private readonly trpc = injectTrpcClient();

  dashboardInfo: DeviceInfoType | null = null;
  loading = false;
  error: string | null = null;

  constructor() {
    addIcons({ refreshOutline, qrCodeOutline });
  }
  
  ionViewWillEnter() {
    // Refresh data every time the view is about to enter
    this.loadDashboardInfo();
  }

  async loadDashboardInfo() {
    // Get deviceId from localStorage
    const deviceId = localStorage.getItem('deviceId');

    if (!deviceId) {
      this.error = 'No device ID found. Please scan a QR code first.';
      return;
    }

    this.loading = true;
    this.error = null;

    TrpcHeaders.set({ [X_DEVICE_ID]: deviceId });

    try {
      // Fetch dashboard info using deviceId
      // Using a simple approach to avoid type issues
      const response = await firstValueFrom(this.trpc.device.info.query());
      this.dashboardInfo = response;
    } catch (err) {
      console.error('Error fetching dashboard info:', err);
      this.error = 'Failed to load dashboard information.';
    } finally {
      this.loading = false;
    }
  }
}