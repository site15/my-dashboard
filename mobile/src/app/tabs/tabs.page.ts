import { Component, EnvironmentInjector, inject } from '@angular/core';
import {
  IonIcon,
  IonLabel,
  IonTabBar,
  IonTabButton,
  IonTabs,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  gridOutline,
  qrCodeOutline,
  settingsOutline
} from 'ionicons/icons';
import { ErrorHandlerService } from '../services/error-handler.service';

@Component({
  selector: 'app-tabs',
  template: `
<ion-tabs>
  <ion-tab-bar slot="bottom">
    <ion-tab-button tab="dashboard" href="/tabs/dashboard">
      <ion-icon aria-hidden="true" name="grid-outline"></ion-icon>
      <ion-label>Dashboard</ion-label>
    </ion-tab-button>

    <ion-tab-button tab="qr-code" href="/tabs/qr-code">
      <ion-icon aria-hidden="true" name="qr-code-outline"></ion-icon>
      <ion-label>QR Code</ion-label>
    </ion-tab-button>

    <ion-tab-button tab="settings" href="/tabs/settings">
      <ion-icon  aria-hidden="true" name="settings-outline"></ion-icon>
      <ion-label>Settings</ion-label>
    </ion-tab-button>
  </ion-tab-bar>
</ion-tabs>
`,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);
  private toastController = inject(ToastController);
  private errorHandler = inject(ErrorHandlerService);

  constructor() {
    addIcons({ settingsOutline, qrCodeOutline, gridOutline });
    // Initialize the error handler with the toast controller
    this.errorHandler.initialize(this.toastController);
  }
}