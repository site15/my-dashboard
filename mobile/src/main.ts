import { bootstrapApplication } from '@angular/platform-browser';
import {
  PreloadAllModules,
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';

import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideTrpcClient } from './app/trpc-client';
import { provideTrpcPureClient } from './app/trpc-pure-client';
import { WINDOW } from '../../web/src/app/utils/window';
import { environment } from './environments/environment';

// Call the element loader before the bootstrapModule/bootstrapApplication call
defineCustomElements(window);

WINDOW.apiUrl = environment.apiUrl;

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({ innerHTMLTemplatesEnabled: true }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideTrpcClient(),
    provideTrpcPureClient(),
  ],
});
