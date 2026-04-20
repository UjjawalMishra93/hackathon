import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getDatabase, type Database } from 'firebase/database';
import { getAnalytics, type Analytics } from 'firebase/analytics';

const firebaseConfig = {
    apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL:       import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

/**
 * Returns true only when ALL required env vars are present.
 * This allows the app to gracefully fall back to mock data in dev
 * without crashing when no .env is configured.
 */
export const isFirebaseConfigured = (): boolean =>
    Boolean(
        firebaseConfig.apiKey &&
        firebaseConfig.apiKey !== 'your_api_key_here' &&
        firebaseConfig.databaseURL &&
        firebaseConfig.databaseURL !== 'https://your_project_id-default-rtdb.firebaseio.com'
    );

// Singleton — avoid re-initialising on hot-reload
let app: FirebaseApp | null = null;
let db:  Database | null = null;
let analytics: Analytics | null = null;

export const getFirebaseApp = (): FirebaseApp => {
    if (!app) {
        app = getApps().length === 0
            ? initializeApp(firebaseConfig)
            : getApps()[0];
    }
    return app;
};

export const getFirebaseDB = (): Database => {
    if (!db) {
        db = getDatabase(getFirebaseApp());
    }
    return db;
};

export const getFirebaseAnalytics = (): Analytics | null => {
    // Analytics only works in browser environments
    if (typeof window === 'undefined') return null;
    if (!analytics) {
        try {
            analytics = getAnalytics(getFirebaseApp());
        } catch {
            console.warn('[VenueFlow] Firebase Analytics not available.');
        }
    }
    return analytics;
};
