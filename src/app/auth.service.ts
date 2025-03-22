import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User,
  getAuth,
  updateProfile,
  sendPasswordResetEmail,
  updatePassword
} from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private authInstance: Auth;

  constructor(private firestore: Firestore) {
    this.authInstance = getAuth(); // ✅ Ensure auth instance is retrieved correctly

    onAuthStateChanged(this.authInstance, (user) => {
      if (user) {
        // console.log("running login page everytime clicking on url in auth service...");
        // console.log('User is logged in:', user);
        this.currentUserSubject.next(user);
      } else {
        // console.log('No user logged in');
        this.currentUserSubject.next(null);
      }
    });
  }

  /**
   * Sign up with email & password and store user details in Firestore
   */
  async signUp(email: string, password: string, name: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.authInstance, email, password);
      const user = userCredential.user;

      if (user) {
        await updateProfile(user, { displayName: name });

        const userDocRef = doc(this.firestore, `users/${user.uid}`);
        await setDoc(userDocRef, {
          name: name,
          email: user.email,
          createdAt: new Date()
        });

        this.currentUserSubject.next(user); // ✅ Update current user state
        return user;
      } else {
        throw new Error('User creation failed.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  /**
   * Log in with email & password
   */
  async logIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.authInstance, email, password);
      await this.fetchUserData(userCredential.user);
      return userCredential.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Google Sign-In
   */
  async googleSignIn() {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(this.authInstance, provider);
      const user = userCredential.user;

      // Check if user already exists in Firestore
      const userRef = doc(this.firestore, `users/${user.uid}`);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          createdAt: new Date()
        });
      }

      await this.fetchUserData(user);
      return user;
    } catch (error) {
      console.error('Google Sign-In error:', error);
      throw error;
    }
  }

  async forgotPassword(email: string) {
    try {
      await sendPasswordResetEmail(this.authInstance, email);
      // console.log('Password reset email sent');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }

  /**
   * Fetch user data from Firestore
   */
  private async fetchUserData(user: User) {
    try {
      const userRef = doc(this.firestore, `users/${user.uid}`);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        this.currentUserSubject.next(userSnap.data() as User);
      } else {
        console.warn('User data not found in Firestore.');
        this.currentUserSubject.next(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  async updateUserProfile(name: string) {
    const user = this.authInstance.currentUser;
    if (user) {
      await updateProfile(user, { displayName: name });
    }
  }

   /**
   * Update User Password
   */
   async updateUserPassword(newPassword: string): Promise<void> {
    try {
      const user = this.authInstance.currentUser;
      if (user) {
        await updatePassword(user, newPassword);
        // console.log('Password updated successfully!');
      } else {
        throw new Error('No user is currently logged in.');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }

  /**
   * Log Out
   */
  async logOut() {
    try {
      await signOut(this.authInstance);
      this.currentUserSubject.next(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
}
