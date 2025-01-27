import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    provideFirebaseApp(() => initializeApp({
      apiKey: "AIzaSyB2lH_ZyhWzQGamZxwIC5zHJyr_3UW94XE",
      authDomain: "subscription-tracker-39050.firebaseapp.com",
      projectId: "subscription-tracker-39050",
      storageBucket: "subscription-tracker-39050.appspot.com",
      messagingSenderId: "464667715284",
      appId: "1:464667715284:web:2cdef19a4e9f5772373d41",
      measurementId: "G-PK7VZMBYD6"
    })),
    provideAuth(() => getAuth()),             // Provide Firebase Auth
    provideFirestore(() => getFirestore())   // Provide Firestore
]};

