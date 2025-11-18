import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {
  AlertController,
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { BrowserQRCodeReader } from '@zxing/browser';
import { addIcons } from 'ionicons';
import { scanOutline } from 'ionicons/icons';
import jsQR from 'jsqr';
import {
  BehaviorSubject,
  catchError,
  first,
  from,
  map,
  mergeMap,
  of,
  tap,
  throwError,
} from 'rxjs';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';

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
          @if (scanResultQrData$ | async; as scanResultQrData) {
          <ion-card>
            <ion-card-content>
              <h2>Scanned Content:</h2>
              <p>{{ scanResultQrData | json }}</p>
              <ion-button (click)="resetScanner()" fill="clear">
                Scan Again
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
    ExploreContainerComponent,
    AsyncPipe,
    JsonPipe,
  ],
})
export class QrCodePage implements OnInit {
  private readonly alertController = inject(AlertController);

  scanResultQrData$ = new BehaviorSubject<any>(null);

  constructor() {
    addIcons({ scanOutline });
  }

  ngOnInit() {
    this.resetScanner();
  }

  startScan() {
    from(scanQRFromCamera())
      .pipe(
        first(),
        map((result) => {
          if (!result) {
            throw new Error('decode failed');
          }
          return result;
        }),
        catchError((err) => {
          console.warn('ZXing2 error:', err);
          if (err.message === 'decode failed') {
            return from(
              this.alertController.create({
                message: 'QR code could not be decoded.',
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
              })
            ).pipe(mergeMap((alert) => alert.present()));
          }
          return throwError(() => err);
        }),
        tap((data) => {
          if (data) {
            console.log(data);
            this.scanResultQrData$.next(data);
          }
        }),
        catchError((error) => {
          console.error('Error scanning barcode:', error);
          return of(null);
        })
      )
      .subscribe();
  }

  resetScanner() {
    this.scanResultQrData$.next(null);
  }
}
