import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';  // Importar las rutas correctamente
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),  // Asegúrate de que las rutas sean del tipo correcto
    provideClientHydration(withEventReplay()), provideAnimationsAsync(), provideAnimationsAsync()  // Este es opcional, si lo estás usando
  ]
};
