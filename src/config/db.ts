import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Database, getDatabase } from 'firebase/database';
import { Firestore, getFirestore } from 'firebase/firestore';

let auth: Auth;
let database: Database;
let app: FirebaseApp;
let firestore: Firestore;

export function connectFirebase() {
  if (!app) {
    app = initializeApp(
      {
        apiKey: import.meta.env.VITE_apiKey,
        authDomain: import.meta.env.VITE_authDomain,
        projectId: import.meta.env.VITE_projectId,
        storageBucket: import.meta.env.VITE_storageBucket,
        messagingSenderId: import.meta.env.VITE_messagingSenderId,
        appId: import.meta.env.VITE_appId,
      },
      'auth-basic'
    );
  }

  if (!database) {
    database = getDatabase(app);
  }

  if (!auth) {
    auth = getAuth(app);
  }

  if (!firestore) {
    firestore = getFirestore(app);
  }

  return { app, auth, database, firestore };
}
