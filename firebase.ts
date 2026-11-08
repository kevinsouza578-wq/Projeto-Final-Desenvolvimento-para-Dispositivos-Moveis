import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseError, getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
import * as firebaseAuth from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

// Estes identificadores pertencem ao projeto Firebase do grupo.
const configuracao = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

if (!configuracao.apiKey || !configuracao.projectId || !configuracao.appId) {
  throw new Error('Configure o Firebase do grupo no arquivo .env conforme o README e reinicie o Expo.');
}
const app = getApps().length ? getApp() : initializeApp(configuracao);

// No celular, o AsyncStorage guarda a sessão entre reinicializações.
function criarAuth() {
  if (Platform.OS === 'web') return getAuth(app);
  // O export existe na versão React Native; os tipos padrão do pacote são Web.
  const persistenciaRN = (firebaseAuth as unknown as {
    getReactNativePersistence: (storage: typeof AsyncStorage) => import('firebase/auth').Persistence;
  }).getReactNativePersistence;
  try { return initializeAuth(app, { persistence: persistenciaRN(AsyncStorage) }); }
  catch (erro) {
    if (erro instanceof FirebaseError && erro.code === 'auth/already-initialized') return getAuth(app);
    throw erro;
  }
}
export const auth = criarAuth();
export const db = getFirestore(app);
