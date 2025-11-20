// import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';
// import { AppComponent } from './app/app.component';

// bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));




import { bootstrapApplication } from '@angular/platform-browser';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// Charge les données de langue FR
registerLocaleData(localeFr);

// Démarre l’app en fixant la locale par défaut à fr-FR
bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers ?? []),
    { provide: LOCALE_ID, useValue: 'fr-FR' }
  ]
}).catch(err => console.error(err));
