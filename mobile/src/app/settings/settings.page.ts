import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { injectTrpcClient } from '../trpc-client';

@Component({
  selector: 'app-settings',
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-title> Settings </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Settings</ion-title>
        </ion-toolbar>
      </ion-header>

      <app-explore-container name="Settings page">{{
        settings$ | async | json
      }}</app-explore-container>
    </ion-content>
  `,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    ExploreContainerComponent,
    AsyncPipe,
    JsonPipe,
  ],
})
export class SettingsPage {
  private trpc = injectTrpcClient();

  settings$ = this.trpc.telegram.settings.query();
}
