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
  IonToolbar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { scanOutline } from 'ionicons/icons';
import parseQRCode from 'qrcode-parser';
import {
  BehaviorSubject,
  catchError,
  first,
  forkJoin,
  from,
  mergeMap,
  of,
  tap,
  throwError,
} from 'rxjs';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';

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
          @if (scanResult$ | async; as scanResult) {
          <ion-card>
            <ion-card-content>
              <h2>Scanned Content:</h2>
              <p>{{ scanResultQrData$ | async | json }}</p>
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

  scanResult$ = new BehaviorSubject<string | null>(null);
  scanResultQrData$ = new BehaviorSubject<any>(null);

  constructor() {
    addIcons({ scanOutline });
  }

  ngOnInit() {
    this.resetScanner();
  }

  startScan() {
    from(
      Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 100,
      })
    )
      .pipe(
        first(),
        mergeMap((photo) => {
          return forkJoin({
            photo: of(photo),
            parsedData: photo.webPath
              ? from(parseQRCode(photo.webPath)).pipe(
                  catchError((err) => {
                    if (err.message === 'decode failed') {
                      return from(
                        this.alertController.create({
                          message: 'QR code could not be decoded.',
                          buttons: [
                            {
                              text: 'Cancel',
                              role: 'cancel',
                              handler: () => {
                                console.log('Alert canceled');
                              },
                            },
                            {
                              text: 'Scan Again',
                              role: 'confirm',
                              handler: () => {
                                this.startScan();
                                console.log('Alert confirmed');
                              },
                            },
                          ],
                        })
                      ).pipe(mergeMap((alert) => alert.present()));
                    }
                    return throwError(() => err);
                  })
                )
              : of(null),
          });
        }),
        tap(({ photo, parsedData }) => {
          if (parsedData) {
            console.log({ photo, parsedData });
            this.scanResult$.next(photo.webPath || '');
            this.scanResultQrData$.next(parsedData);
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
    this.scanResult$.next(null);
    this.scanResultQrData$.next(null);
  }
}
