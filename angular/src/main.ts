import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Punto de entrada: inicia la aplicación usando la configuración global.
bootstrapApplication(AppComponent, appConfig)
  .catch(error => console.error('Error al iniciar Angular:', error));
