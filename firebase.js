// Firebase initialization and Firestore helpers
// Replace the firebaseConfig values with your Firebase project's config.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  setDoc,
  doc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDZ9NpyKG_79nTtToCQj75bXnP5JMj4ZGI",
  authDomain: "zyloh-store.firebaseapp.com",
  projectId: "zyloh-store",
  storageBucket: "zyloh-store.firebasestorage.app",
  messagingSenderId: "533877217986",
  appId: "1:533877217986:web:73272e3c0685d1cabbf95b",
  measurementId: "G-DRQCHNS0XG",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const productosCol = collection(db, "productos");

export async function fetchProductos() {
  const q = query(productosCol, orderBy("id"));
  const snap = await getDocs(q);
  const arr = [];
  snap.forEach((d) => arr.push(d.data()));
  // Order by id if present
  return arr;
}

export async function upsertProducto(data) {
  // Use product id as document id for stability
  const id = String(data.id);
  await setDoc(doc(productosCol, id), data, { merge: true });
}

export async function removeProducto(id) {
  await deleteDoc(doc(productosCol, String(id)));
}
