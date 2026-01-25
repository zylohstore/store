# Hype Steals Firebase Migration

This project now uses Firebase Firestore to store products instead of `localStorage`.

## Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Add a Web App to get your config values (API key, project ID, etc.).
3. Enable Firestore (Build → Firestore Database → Create database).
4. In the `productos` collection, you can let the app create documents or add them manually.
5. Open [`firebase.js`](firebase.js) and replace the placeholder `firebaseConfig` with your actual values:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

## Usage

- Admin panel: open [`admin.html`](admin.html), enter the password, then create/edit/delete products. Each product is saved to Firestore with its `id` as the document id.
- Storefront: open [`index.html`](index.html) and [`producto.html`](producto.html). These pages load products from Firestore on startup.

## Notes

- Theme (dark/light) preference still uses `localStorage`. Product data is fully moved to Firestore.
- The app uses Firebase v9 modular CDN imports; ensure your pages are served over HTTP(s) when testing in browsers that block `file://` with modules.
