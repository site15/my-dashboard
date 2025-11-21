import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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
import { scanOutline } from 'ionicons/icons';
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
import { injectTrpcClient, TrpcHeaders } from '../trpc-client';
import { ErrorHandlerService } from '../services/error-handler.service';

//
// --- 1. Снять фото через камеру ---
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
// --- 2. Декодирование через ZXing (основной путь) ---
//
export async function decodeZXing(dataUrl: string): Promise<string | null> {
  const reader = new BrowserQRCodeReader();

  try {
    const result = await reader.decodeFromImageUrl(dataUrl);
    return result.getText(); // <- новый API ZXing
  } catch (err) {
    console.warn('ZXing decode error:', err);
    return null;
  }
}

//
// --- 3. Fallback: jsQR (читает даже сильно повреждённые QR) ---
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
// --- 4. Комбинированная обработка + улучшение изображения ---
//
async function preprocess(dataUrl: string): Promise<string> {
  try {
    const img = new Image();
    img.src = dataUrl;
    await img.decode();

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    // увеличиваем изображение ×2 для лучшего качества
    canvas.width = img.width * 2;
    canvas.height = img.height * 2;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // чёткая бинаризация (улучшает читаемость QR)
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
// --- 5. Основная функция: сделать фото + распознать QR ---
//
export async function scanQRFromCamera(): Promise<string | null> {
  try {
    const dataUrl = await takeCameraPhoto();
    if (!dataUrl) return null;

    // 1) Пробуем ZXing в чистом виде

    const zxing = await decodeZXing(dataUrl);
    if (zxing) return zxing;

    // 2) Предобрабатываем (улучшение контраста)
    const enhanced = await preprocess(dataUrl);

    // 3) Пробуем ZXing снова
    const zxingEnhanced = await decodeZXing(enhanced);
    if (zxingEnhanced) return zxingEnhanced;

    // 4) Пробуем jsQR (часто спасает разрушенный QR)
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
  private readonly trpc = injectTrpcClient();
  private readonly router = inject(Router);

  scanResultQrData$ = new BehaviorSubject<QrCodeData | null>(null);
  isLoading$ = new BehaviorSubject<boolean>(false);

  constructor() {
    addIcons({ scanOutline });
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

          // Parse the QR code data
          try {
            const qrData: QrCodeData = JSON.parse(result);

            // Generate a unique device ID (in a real app, you might want to use a more robust method)
            const deviceId = this.generateDeviceId();

            // Call the device/link API
            return from(
              this.trpc.device.link.mutate({
                code: qrData.code,
                deviceId: deviceId,
              })
            ).pipe(
              map(() => qrData), // Return the QR data on success
              catchError((err) => {
                console.error('Error linking device:', err);
                // Handle the error using our global error handler
                this.errorHandler.handleError(err, 'Failed to link device').catch(console.error);
                throw new Error('link failed');
              })
            );
          } catch (parseError) {
            console.error('Error parsing QR code data:', parseError);
            // Handle the error using our global error handler
            this.errorHandler.handleError(parseError, 'Invalid QR code format').catch(console.error);
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
          if (data && typeof data === 'object' && 'dashboardId' in data) {
            console.log('Device linked successfully:', data);
            this.scanResultQrData$.next(data);
            // Navigate to the dashboard tab after successful linking
            this.router.navigate(['/tabs/dashboard']);
          }
        }),
        catchError((error) => {
          console.error('Error scanning barcode:', error);
          // Handle the error using our global error handler
          this.errorHandler.handleError(error, 'Error scanning QR code').catch(console.error);
          return of(null);
        }),
        // Always set loading state to false when the operation completes
        finalize(() => {
          this.isLoading$.next(false);
        })
      )
      .subscribe();
  }

  resetScanner() {
    this.scanResultQrData$.next(null);
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