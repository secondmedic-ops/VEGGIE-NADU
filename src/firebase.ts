import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  getDocFromServer,
  onSnapshot,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../firebase-applet-config.json';
import { initialCategories, initialProducts } from './data/seedData';
import { Category, Product, Order, BulkRequest } from './types';

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with the provisioned database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firebase Storage
export const storage = getStorage(app);

// Validate connection on startup as required by skill guidelines
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('[Veggie Nadu] Firebase connected successfully.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Veggie Nadu] Firebase client is offline or network restricted.');
    } else {
      console.log('[Veggie Nadu] Firebase initialized and ready.');
    }
    return false;
  }
}

// Seed initial South Indian catalog to Firestore if collection is empty
export async function seedInitialCatalogIfEmpty(): Promise<{ categories: Category[]; products: Product[] }> {
  try {
    const catCol = collection(db, 'categories');
    const catSnapshot = await getDocs(catCol);

    if (catSnapshot.empty) {
      console.log('[Veggie Nadu] Seeding initial categories to Firestore...');
      for (const cat of initialCategories) {
        await setDoc(doc(db, 'categories', cat.id), cat);
      }
    }

    const prodCol = collection(db, 'products');
    const prodSnapshot = await getDocs(prodCol);

    if (prodSnapshot.empty) {
      console.log('[Veggie Nadu] Seeding initial products to Firestore...');
      for (const prod of initialProducts) {
        await setDoc(doc(db, 'products', prod.id), prod);
      }
    }

    return { categories: initialCategories, products: initialProducts };
  } catch (err) {
    console.warn('[Veggie Nadu] Using local seed data while remote sync runs:', err);
    return { categories: initialCategories, products: initialProducts };
  }
}
