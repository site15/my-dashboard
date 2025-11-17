import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';

@Component({
  selector: 'app-qr-code',
  template: `
<ion-header [translucent]="true">
  <ion-toolbar>
    <ion-title>
      QR Code
    </ion-title>
  </ion-toolbar>
</ion-header>

<ion-content [fullscreen]="true">
  <ion-header collapse="condense">
    <ion-toolbar>
      <ion-title size="large">QR Code</ion-title>
    </ion-toolbar>
  </ion-header>

  <app-explore-container name="QR Code page"></app-explore-container>
</ion-content>
`,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent]
})
export class QrCodePage {

  constructor() {}

}