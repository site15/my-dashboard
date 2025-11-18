import { Component, OnInit } from '@angular/core';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { scanOutline } from 'ionicons/icons';
import { catchError, first, from, map, of, tap } from 'rxjs';
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
          @if (scanResult===null) {
          <ion-button (click)="startScan()">
            <ion-icon name="scan-outline" slot="start"></ion-icon>
            Scan QR Code
          </ion-button>
          } @else {
          <ion-card>
            <ion-card-content>
              <h2>Scanned Content:</h2>
              <p>{{ scanResult }}</p>
              <ion-button (click)="resetScanner()" fill="clear">
                Scan Again
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
    IonButton,
    IonCard,
    IonCardContent,
    IonIcon,
    ExploreContainerComponent,
  ],
})
export class QrCodePage implements OnInit {
  scanResult: string | null = null;

  constructor() {
    addIcons({ scanOutline });
  }

  ngOnInit() {
    this.scanResult = null;
  }

  startScan() {
    /*
    from(
      CapacitorBarcodeScanner.scanBarcode({
        hint: CapacitorBarcodeScannerTypeHint.ALL,
        web: { showCameraSelection: true },
        scanButton: true,
      })
    )
      .pipe(
        first(),
        tap((result) => console.log({ result })),
        map((result) => result.ScanResult),
        catchError((error) => {
          console.error('Error scanning barcode:', error);
          return of(null);
        })
      )
      .subscribe((result) => {
        this.scanResult = result;
      });*/
  }

  resetScanner() {
    this.scanResult = null;
  }
}
