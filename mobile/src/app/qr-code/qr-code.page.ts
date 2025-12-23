import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {
  AlertController,
  IonButton,
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
import { BrowserQRCodeReader } from '@zxing/browser';
import { addIcons } from 'ionicons';
import { keypadOutline, scanOutline } from 'ionicons/icons';
import jsQR from 'jsqr';
import {
  BehaviorSubject,
  catchError,
  finalize,
  first,
  from,
  map,
  mergeMap,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { DeviceService } from '../services/device.service';
import { ErrorHandlerService } from '../services/error-handler.service';
import { TrpcHeaders } from '../trpc-client';
import { TrpcPureHeaders } from '../trpc-pure-client';

//
// --- 1. Take photo via camera ---
//
export async function takeCameraPhoto(): Promise<string | null> {
  try {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      quality: 100,
    });

    return photo.dataUrl ?? null;
  } catch (err) {
    console.error('Camera error:', err);
    return null;
  }
}

//
// --- 2. Decoding via ZXing (main path) ---
//
export async function decodeZXing(dataUrl: string): Promise<string | null> {
  const reader = new BrowserQRCodeReader();

  try {
    const result = await reader.decodeFromImageUrl(dataUrl);
    return result.getText(); // <- new ZXing API
  } catch (err) {
    console.warn('ZXing decode error:', err);
    return null;
  }
}

//
// --- 3. Fallback: jsQR (reads even heavily damaged QR codes) ---
//
export async function decodeJsQR(dataUrl: string): Promise<string | null> {
  const img = new Image();
  img.src = dataUrl;
  await img.decode();

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  canvas.width = img.width;
  canvas.height = img.height;

  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const result = jsQR(imageData.data, canvas.width, canvas.height, {
    inversionAttempts: 'attemptBoth',
  });

  return result?.data || null;
}

//
// --- 4. Combined processing + image enhancement ---
//
async function preprocess(dataUrl: string): Promise<string> {
  try {
    const img = new Image();
    img.src = dataUrl;
    await img.decode();

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    // Increase image size ×2 for better quality
    canvas.width = img.width * 2;
    canvas.height = img.height * 2;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Sharp binarization (improves QR readability)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const bw = avg > 130 ? 255 : 0;
      data[i] = data[i + 1] = data[i + 2] = bw;
    }

    ctx.putImageData(imageData, 0, 0);

    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error(error);
    throw error;
  }
}

//
// --- 5. Main function: take photo + recognize QR ---
//
export async function scanQRFromCamera(): Promise<string | null> {
  try {
    const dataUrl = await takeCameraPhoto();
    if (!dataUrl) return null;

    // 1) Try ZXing in pure form

    const zxing = await decodeZXing(dataUrl);
    if (zxing) return zxing;

    // 2) Preprocess (contrast enhancement)
    const enhanced = await preprocess(dataUrl);

    // 3) Try ZXing again
    const zxingEnhanced = await decodeZXing(enhanced);
    if (zxingEnhanced) return zxingEnhanced;

    // 4) Try jsQR (often saves damaged QR)
    const jsqr = await decodeJsQR(dataUrl);
    if (jsqr) return jsqr;

    const jsqrEnhanced = await decodeJsQR(enhanced);
    if (jsqrEnhanced) return jsqrEnhanced;

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// QR Code data structure
interface QrCodeData {
  dashboardId: string;
  code: string;
  apiUrl: string;
}

@Component({
  selector: 'app-qr-code',
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-title> QR Code </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">QR Code</ion-title>
        </ion-toolbar>
      </ion-header>

      <app-explore-container name="QR Code page">
        <div style="padding: 20px; text-align: center;">
          @if (isLoading$ | async) {
          <div
            style="display: flex; flex-direction: column; align-items: center; gap: 16px;"
          >
            <ion-spinner></ion-spinner>
            <p>Scanning QR code...</p>
          </div>
          } @else if (scanResultQrData$ | async; as scanResultQrData) {
          <ion-card>
            <ion-card-content>
              <h2>Device Linked Successfully!</h2>
              <p>Dashboard ID: {{ scanResultQrData.dashboardId }}</p>
              <ion-button (click)="resetScanner()" fill="clear">
                Scan Another QR Code
              </ion-button>
            </ion-card-content>
          </ion-card>
          } @else {
          <ion-button (click)="startScan()">
            <ion-icon name="scan-outline" slot="start"></ion-icon>
            Scan QR Code
          </ion-button>
          <br />
          <ion-button
            (click)="startManualCodeEntry()"
            fill="outline"
            style="margin-top: 10px;"
          >
            <ion-icon name="keypad-outline" slot="start"></ion-icon>
            Enter Code Manually
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
    IonButton,
    IonCard,
    IonCardContent,
    IonIcon,
    IonSpinner,
    ExploreContainerComponent,
    AsyncPipe,
  ],
})
export class QrCodePage {
  private readonly alertController = inject(AlertController);
  private readonly toastController = inject(ToastController);
  private readonly errorHandler = inject(ErrorHandlerService);
  private readonly router = inject(Router);
  private readonly deviceService = inject(DeviceService);

  scanResultQrData$ = new BehaviorSubject<QrCodeData | null>(null);
  isLoading$ = new BehaviorSubject<boolean>(false);

  constructor() {
    addIcons({ scanOutline, keypadOutline });
    // Initialize the error handler with the toast controller
    this.errorHandler.initialize(this.toastController);
  }

  ionViewWillEnter() {
    this.resetScanner();
  }

  startScan() {
    // Set loading state to true when starting the scan
    this.isLoading$.next(true);

    from(scanQRFromCamera())
      .pipe(
        first(),
        mergeMap((result) => {
          if (!result) {
            throw new Error('decode failed');
          }

          TrpcHeaders.set({});
          TrpcPureHeaders.set({});

          // Parse the QR code data
          try {
            const qrData: QrCodeData = JSON.parse(result);
            const code = qrData.code;
            // Generate a unique device ID (in a real app, you might want to use a more robust method)
            return this.link(code).pipe(
              map(() => qrData) // Return the QR data on success
            );
          } catch (parseError) {
            console.error('Error parsing QR code data:', parseError);
            // Handle the error using our global error handler
            this.errorHandler
              .handleError(parseError, 'Invalid QR code format')
              .catch(console.error);
            throw new Error('invalid qr code');
          }
        }),
        catchError((err) => {
          console.warn('Scan error:', err);
          // Handle the error by showing an alert and returning null to continue the stream
          const errorMessage = err instanceof Error ? err.message : String(err);
          return from(this.showScanErrorAlert(errorMessage)).pipe(
            switchMap(() => of(null))
          );
        }),
        tap((data) => {
          console.log('Device linked successfully:', data);
          if (data && typeof data === 'object' && 'id' in data) {
            this.scanResultQrData$.next(data);
            // Navigate to the dashboard tab after successful linking
            this.router.navigate(['/tabs/dashboard']);
          }
        }),
        catchError((error) => {
          console.error('Error scanning barcode:', error);
          // Handle the error using our global error handler
          this.errorHandler
            .handleError(error, 'Error scanning QR code')
            .catch(console.error);
          return of(null);
        }),
        // Always set loading state to false when the operation completes
        finalize(() => {
          this.isLoading$.next(false);
        })
      )
      .subscribe();
  }

  private link(code: string) {
    const deviceId = this.generateDeviceId();

    // Call the device/link API
    return from(
      this.deviceService.link({
        code,
        deviceId,
      })
    ).pipe(
      catchError((err) => {
        console.error('Error linking device:', err);
        // Handle the error using our global error handler
        this.errorHandler
          .handleError(err, 'Failed to link device')
          .catch(console.error);
        throw new Error('link failed');
      })
    );
  }

  resetScanner() {
    this.scanResultQrData$.next(null);
  }

  async startManualCodeEntry() {
    const alert = await this.alertController.create({
      header: 'Enter Code',
      inputs: [
        {
          name: 'code',
          type: 'text',
          placeholder: 'Enter the code',
          value: '',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Send',
          handler: (data) => {
            if (data && data.code) {
              this.processManualCode(data.code);
            }
          },
        },
      ],
    });

    await alert.present();
  }

  processManualCode(code: string) {
    // Set loading state to true when processing the manual code
    this.isLoading$.next(true);

    // Generate a unique device ID
    const deviceId = this.generateDeviceId();

    TrpcHeaders.set({});
    TrpcPureHeaders.set({});

    // Call the device/link API
    this.link(code)
      .pipe(
        first(),
        tap((data: any) => {
          console.log('Device linked successfully:', data);
          if (data && typeof data === 'object' && 'id' in data) {
            this.scanResultQrData$.next(data);
            // Navigate to the dashboard tab after successful linking
            this.router.navigate(['/tabs/dashboard']);
          }
        }),
        catchError((error) => {
          console.error('Error scanning barcode:', error);
          // Handle the error using our global error handler
          this.errorHandler
            .handleError(error, 'Error scanning QR code')
            .catch(console.error);
          return of(null);
        }),
        // Always set loading state to false when the operation completes
        finalize(() => {
          this.isLoading$.next(false);
        })
      )
      .subscribe();
  }

  private generateDeviceId(): string {
    // Check if we already have a device ID in local storage
    const storedDeviceId = localStorage.getItem('deviceId');
    if (storedDeviceId) {
      return storedDeviceId;
    }

    // Generate a new device ID if none exists
    const newDeviceId =
      'device_' +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    // Store it in local storage for future use
    localStorage.setItem('deviceId', newDeviceId);

    return newDeviceId;
  }

  private async showScanErrorAlert(errorMessage: string) {
    let alertMessage = 'An unknown error occurred. Please try again.';

    if (errorMessage === 'decode failed') {
      alertMessage = 'QR code could not be decoded.';
    } else if (errorMessage === 'invalid qr code') {
      alertMessage = 'Invalid QR code format.';
    } else if (errorMessage === 'link failed') {
      alertMessage = 'Failed to link device. Please try again.';
    }

    const alert = await this.alertController.create({
      message: alertMessage,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'Scan Again',
          role: 'confirm',
          handler: () => {
            this.startScan();
          },
        },
      ],
    });

    await alert.present();
  }
}
