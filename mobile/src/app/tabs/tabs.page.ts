import {
  ChangeDetectionStrategy,
  Component,
  EnvironmentInjector,
  inject,
} from '@angular/core';
import {
  IonIcon,
  IonLabel,
  IonTabBar,
  IonTabButton,
  IonTabs,
  Platform,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { gridOutline, qrCodeOutline, settingsOutline } from 'ionicons/icons';
import { ErrorHandlerService } from '../services/error-handler.service';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if ((hideTabs$|async)!==true){
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
          <ion-icon aria-hidden="true" name="settings-outline"></ion-icon>
          <ion-label>Settings</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
    }@else {

    <ion-tabs> </ion-tabs>
    }
  `,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, AsyncPipe],
})
export class TabsPage {
  hideTabs$ = new BehaviorSubject(false);
  public environmentInjector = inject(EnvironmentInjector);
  private toastController = inject(ToastController);
  private errorHandler = inject(ErrorHandlerService);

  private readonly platform = inject(Platform);

  constructor() {
    addIcons({ settingsOutline, qrCodeOutline, gridOutline });
    // Initialize the error handler with the toast controller
    this.errorHandler.initialize(this.toastController);
  }

  ionViewWillEnter() {
    this.platform.resize.subscribe(() => {
      console.log('Размер экрана изменился');
      console.log('Портрет?', this.platform.isPortrait());
      console.log('Ландшафт?', this.platform.isLandscape());
      this.hideTabs$.next(this.platform.isLandscape());
    });

    this.hideTabs$.next(this.platform.isLandscape());
  }
}
