import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideRouter } from '@angular/router';
import { appConfig } from './app/app.config';
import { routes } from './app/app.routes';
import { environment } from './environments/environment';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)), // ✅ Initialize Firebase
    provideAuth(() => getAuth()), // ✅ Provide Authentication
    provideFirestore(() => getFirestore()), // ✅ Provide Firestore
    provideStorage(() => getStorage()), // ✅ Provide Storage
    provideRouter(routes), // ✅ Provide Router
    provideHttpClient(), // ✅ Provide HTTP Client
  ],
}).catch(err => console.error(err));
