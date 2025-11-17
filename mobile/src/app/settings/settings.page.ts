import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';

@Component({
  selector: 'app-settings',
  template: `
<ion-header [translucent]="true">
  <ion-toolbar>
    <ion-title>
      Settings
    </ion-title>
  </ion-toolbar>
</ion-header>

<ion-content [fullscreen]="true">
  <ion-header collapse="condense">
    <ion-toolbar>
      <ion-title size="large">Settings</ion-title>
    </ion-toolbar>
  </ion-header>

  <app-explore-container name="Settings page"></app-explore-container>
</ion-content>
`,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent],
})
export class SettingsPage {
  constructor() {}
}