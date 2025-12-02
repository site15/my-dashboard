import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  IonApp,
  IonRouterOutlet,
  ToastController,
} from '@ionic/angular/standalone';
import { ErrorHandlerService } from './services/error-handler.service';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  `,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  private toastController = inject(ToastController);
  private errorHandler = inject(ErrorHandlerService);

  constructor() {
    // Initialize the error handler with the toast controller
    this.errorHandler.initialize(this.toastController);
  }
}
