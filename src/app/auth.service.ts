import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from '@angular/fire/auth';
import { browserLocalPersistence, setPersistence, User } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  // constructor(private auth: Auth) {
    // Set persistence to local (keeps the user logged in across reloads)
  //   setPersistence(this.auth, browserLocalPersistence)
  //     .then(() => {
  //       console.log('Persistence set to local');
  //       // Listen for auth state changes
  //       onAuthStateChanged(this.auth, (user) => {
  //         this.currentUserSubject.next(user);
  //         console.log('Auth state changed:', user ? user.email : 'No user');
  //       });
  //     })
  //     .catch((error) => console.error('Error setting persistence:', error));
  // }

  constructor(private auth: Auth) {
    // Set persistence to local
    setPersistence(this.auth, browserLocalPersistence).catch((error) =>
      console.error('Error setting persistence:', error)
    );
  }

    // Sign Up with email and password
    signUp(email: string, password: string) {
      return createUserWithEmailAndPassword(this.auth, email, password);
    }

    // Log In with email and password
    logIn(email: string, password: string) {
      return signInWithEmailAndPassword(this.auth, email, password);
    }

    // Google Sign-In
    googleSignIn() {
      const provider = new GoogleAuthProvider();
      return signInWithPopup(this.auth, provider);
    }

    // Log Out
    logOut() {
      return signOut(this.auth);
    }

}
