import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseError, getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, initializeAuth, type Auth, type Persistence } from 'firebase/auth';
import * as firebaseAuth from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDyVmyJLPVUl-GNR_6AWzou2HmPQeSjSBU',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'oficina360-75f96.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'oficina360-75f96',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'oficina360-75f96.firebasestorage.app',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '749850138004',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:749850138004:web:269ab0c2a049fd89482b81',
};

const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

function criarAuth(): Auth {
  if (Platform.OS === 'web') return getAuth(app);
  const persistenciaRN = (firebaseAuth as unknown as {
    getReactNativePersistence: (storage: typeof AsyncStorage) => Persistence;
  }).getReactNativePersistence;
  try {
    return initializeAuth(app, { persistence: persistenciaRN(AsyncStorage) });
  } catch (erro) {
    if (erro instanceof FirebaseError && erro.code === 'auth/already-initialized') return getAuth(app);
    throw erro;
  }
}

export const auth: Auth = criarAuth();
export const db: Firestore = getFirestore(app);
export default app;
