// Firebase initialization and Firestore helpers
// Replace the firebaseConfig values with your Firebase project's config.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const productosCol = collection(db, "productos");

export async function fetchProductos() {
  const snap = await getDocs(productosCol);
  const arr = [];
  snap.forEach((d) => arr.push(d.data()));
  // Order by id if present
  return arr.sort((a, b) => (a.id || 0) - (b.id || 0));
}

export async function upsertProducto(data) {
  // Use product id as document id for stability
  const id = String(data.id);
  await setDoc(doc(productosCol, id), data, { merge: true });
}

export async function removeProducto(id) {
  await deleteDoc(doc(productosCol, String(id)));
}
