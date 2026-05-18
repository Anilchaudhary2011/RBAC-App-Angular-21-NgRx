import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideAuthInitializer } from './core/providers/auth.initializer';
import { provideAppStore } from './store';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAppStore(),
    provideAuthInitializer(),
    provideCharts(withDefaultRegisterables()),
  ],
};
