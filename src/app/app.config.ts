import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';  // Importar las rutas correctamente
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import Material from '@primeng/themes/material';
import Nora from '@primeng/themes/nora';
import Lara from '@primeng/themes/lara';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),  // Asegúrate de que las rutas sean del tipo correcto
    provideClientHydration(withEventReplay()), provideAnimationsAsync(), provideAnimationsAsync(),providePrimeNG({
      theme: {
          preset: Aura,
          options: {
              prefix: 'p',
              darkModeSelector: false,
              cssLayer: false,
              ripple: true
          }
          
      }
  })  // Este es opcional, si lo estás usando
  ]
};
