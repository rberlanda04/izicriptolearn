import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Config do Firebase Web SDK: a apiKey aqui NÃO é um segredo — o Firebase é desenhado
// para essa config ficar embutida no bundle do cliente (a segurança real vem das
// Regras de Segurança do Firebase, configuradas no console, não de esconder isso).
// Ainda assim usamos variáveis de ambiente para poder trocar de projeto sem editar código.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBX_DS9az41VnhmNJpBvI4MEnz_VTr7VPY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'izicriptolearn.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'izicriptolearn',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'izicriptolearn.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '519027844597',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:519027844597:web:bd2f9d1ab2807fd4e4ecbc',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-S6RQPW9W2G',
};

export const firebaseApp = initializeApp(firebaseConfig);

// getAnalytics quebra em ambientes sem suporte (SSR, alguns navegadores com bloqueadores
// de rastreamento) — isSupported() evita isso derrubar o app inteiro por causa de analytics.
export let analytics = null;
isSupported()
  .then((supported) => {
    if (supported) analytics = getAnalytics(firebaseApp);
  })
  .catch(() => {
    // Bloqueador de anúncios/rastreamento impedindo o script do Analytics — não é um erro
    // que deveria quebrar a aplicação, só significa que não teremos métricas dessa sessão.
  });
