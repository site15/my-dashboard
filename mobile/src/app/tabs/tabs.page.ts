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
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

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
      if (this.isLandscape()) {
        this.setLandscapeFullscreen();
      } else {
        this.exitFullscreen();
      }
    });

    if (this.isLandscape()) {
      this.setLandscapeFullscreen();
    } else {
      this.exitFullscreen();
    }
  }

  private isLandscape() {
    return this.platform.isLandscape();
  }

  async setLandscapeFullscreen() {
    this.hideTabs$.next(true);

    try {
      // Lock to landscape
      if (
        Capacitor.isNativePlatform() &&
        (window as any).Capacitor?.Plugins?.ScreenOrientation
      ) {
        await (window as any).Capacitor.Plugins.ScreenOrientation.lock({
          orientation: 'landscape',
        });
      }

      // Hide status bar for fullscreen experience
      await StatusBar.hide();

      // Set immersive mode to hide navigation buttons
      await StatusBar.setOverlaysWebView({ overlay: true });

      // For Android, we need to use the native API to hide system UI
      if (this.isAndroid()) {
        await this.setAndroidFullscreen(true);
      }
    } catch (error) {
      console.error('Error setting landscape fullscreen:', error);
    }
  }

  async exitFullscreen() {
    this.hideTabs$.next(false);

    try {
      // Show status bar
      await StatusBar.show();

      // Disable immersive mode
      await StatusBar.setOverlaysWebView({ overlay: false });

      // Set status bar style back to default
      await StatusBar.setStyle({ style: Style.Light });

      // For Android, we need to exit immersive mode
      if (this.isAndroid()) {
        await this.setAndroidFullscreen(false);
      }
    } catch (error) {
      console.error('Error exiting fullscreen:', error);
    }
  }

  private isAndroid(): boolean {
    return Capacitor.getPlatform() === 'android';
  }

  private async setAndroidFullscreen(fullscreen: boolean) {
    try {
      if (Capacitor.isNativePlatform()) {
        if (fullscreen) {
          // For Android, we'll use the StatusBar plugin to hide system UI
          await StatusBar.hide();

          // Set immersive mode to hide navigation buttons
          await StatusBar.setOverlaysWebView({ overlay: true });

          // Try to set the Android system UI flags for fullscreen
          if (Capacitor.getPlatform() === 'android') {
            // Set the system UI visibility flags
            if (Capacitor.isNativePlatform()) {
              (window as any).StatusBar?.overlaysWebView?.(true);
            }
          }
        } else {
          // Exit fullscreen mode
          await StatusBar.show();
          await StatusBar.setOverlaysWebView({ overlay: false });
          await StatusBar.setStyle({ style: Style.Light });
        }
      }
    } catch (error) {
      console.warn('Could not set Android fullscreen mode:', error);

      // Fallback: just use status bar
      try {
        if (fullscreen) {
          await StatusBar.hide();
          await StatusBar.setOverlaysWebView({ overlay: true });
        } else {
          await StatusBar.show();
          await StatusBar.setOverlaysWebView({ overlay: false });
        }
      } catch (fallbackError) {
        console.warn('Fallback method also failed:', fallbackError);
      }
    }
  }
}
