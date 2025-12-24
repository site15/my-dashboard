import { AsyncPipe } from '@angular/common';
import { Component, inject, ViewChild, ViewChildren } from '@angular/core';
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
  mergeMap,
  of,
  tap,
} from 'rxjs';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { DeviceService } from '../services/device.service';
import { ErrorHandlerService } from '../services/error-handler.service';
import { TrpcHeaders } from '../trpc-client';
import { TrpcPureHeaders } from '../trpc-pure-client';
import { NgxHtml5QrcodeComponent } from './ngx-html5-qrcode.component';

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
          @if (showScanner$ | async) {
          <div style="width: 100%; height:100%; ">
            <div style="width: 100%; height: 80%;">
              <html5-qrcode
                (decodedText)="onDecodedText($event)"
                style="width: 100%; height: 90%;"
                #qrcode
              >
              </html5-qrcode>
            </div>
            <div
              style="display: flex; justify-content: center;padding-top: 10px; gap: 10px;"
            >
              <ion-button size="small" (click)="qrcode.switchCamera()">
                Switch camera
              </ion-button>
              <ion-button size="small" (click)="stopScan()">
                Stop camera
              </ion-button>
            </div>
          </div>
          } @if (isLoading$ | async) {
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
              <ion-button (click)="resetScanner()" fill="clear">
                Scan Another QR Code
              </ion-button>
            </ion-card-content>
          </ion-card>
          } @else {
          <div
            style="display: flex; justify-content: center;padding-top: 10px; gap: 10px;"
          >
            @if ((showScanner$|async)===false) {
            <ion-button (click)="startScan()">
              <ion-icon name="scan-outline" slot="start"></ion-icon>
              Scan QR
            </ion-button>
            }
            <ion-button (click)="startManualCodeEntry()" fill="outline">
              <ion-icon name="keypad-outline" slot="start"></ion-icon>
              Enter Code
            </ion-button>
          </div>
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
    NgxHtml5QrcodeComponent,
  ],
})
export class QrCodePage {
  private readonly alertController = inject(AlertController);
  private readonly toastController = inject(ToastController);
  private readonly errorHandler = inject(ErrorHandlerService);
  private readonly router = inject(Router);
  private readonly deviceService = inject(DeviceService);

  scanResultQrData$ = new BehaviorSubject<QrCodeData | null>(null);
  showScanner$ = new BehaviorSubject<boolean>(false);
  isLoading$ = new BehaviorSubject<boolean>(false);

  @ViewChild('#qrcode', { static: true })
  qrcode?: NgxHtml5QrcodeComponent;

  constructor() {
    addIcons({ scanOutline, keypadOutline });
    // Initialize the error handler with the toast controller
    this.errorHandler.initialize(this.toastController);
  }

  onDecodedText(data: any) {
    try {
      const parsedData = JSON.parse(data);
      if (!parsedData.dashboardId) {
        throw new Error('wrong data');
      }

      of(parsedData)
        .pipe(
          first(),
          mergeMap((qrData: QrCodeData) => {
            // Generate a unique device ID (in a real app, you might want to use a more robust method)
            return this.link(qrData.code, 'camera');
          })
        )
        .subscribe();
    } catch (error) {
      // Handle the error using our global error handler
      this.errorHandler
        .handleError('Invalid QR code parsed data')
        .catch(console.error);
    }
  }

  ionViewWillEnter() {
    this.resetScanner();
  }

  ionViewDidLeave() {
    this.stopScan();
  }

  startScan() {
    this.qrcode?.stopHtmlQrCode();
    this.showScanner$.next(true);
  }

  stopScan() {
    this.qrcode?.stopHtmlQrCode();
    this.showScanner$.next(false);
  }

  private link(code: string, mode: 'camera' | 'manual') {
    if (
      this.isLoading$.value ||
      (mode === 'camera' && !this.showScanner$.value)
    ) {
      return of(null);
    }

    TrpcHeaders.set({});
    TrpcPureHeaders.set({});

    // Set loading state to true when processing the manual code
    this.isLoading$.next(true);

    const deviceId = this.generateDeviceId();

    // Call the device/link API
    return from(
      this.deviceService.link({
        code,
        deviceId,
      })
    ).pipe(
      tap((data) => {
        this.stopScan();
        console.info('Device linked successfully:', data);
        if (data && typeof data === 'object' && 'id' in data) {
          this.scanResultQrData$.next({ dashboardId: '', code, apiUrl: '' });
          // Navigate to the dashboard tab after successful linking
          this.router.navigate(['/tabs/dashboard']);
        }
      }),
      catchError((err) => {
        console.error('Error linking device:', err);
        // Handle the error using our global error handler
        this.errorHandler
          .handleError(err, 'Failed to link device')
          .catch(console.error);
        if (
          err.message === 'QR code not found' ||
          err.message === 'QR code already used'
        ) {
          this.stopScan();
        }
        return of(null);
      }),
      // Always set loading state to false when the operation completes
      finalize(() => {
        this.isLoading$.next(false);
      })
    );
  }

  resetScanner() {
    this.scanResultQrData$.next(null);
    this.showScanner$.next(false);
    this.isLoading$.next(false);
  }

  async startManualCodeEntry() {
    this.showScanner$.next(false);
    this.isLoading$.next(false);

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
    // Call the device/link API
    this.link(code, 'manual').pipe(first()).subscribe();
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
}
