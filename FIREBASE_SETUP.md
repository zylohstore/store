# Firebase Setup Guía Completa

## 1. Crear Usuario Admin en Firebase Auth

1. Ve a [Firebase Console](https://console.firebase.google.com) → Tu proyecto **zyloh-store**
2. Selecciona **Authentication** (izquierda)
3. En la tab **Users**, haz clic en **Add user**
4. Ingresa:
   - **Email:** tu email (ej. `admin@zyloh.com`)
   - **Password:** contraseña fuerte (ej. `TuContraseña123!`)
5. Copia el **User ID** (lo usarás abajo)

## 2. Asignar Claim Admin (Opcional pero Recomendado)

Para asegurar que solo TÚ puedas escribir en Firestore, asigna un custom claim `admin`:

### Opción A: Vía Cloud Functions (Recomendado)
1. Ve a **Functions** en Firebase Console
2. Crea una nueva función con este código:

```javascript
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.setAdminClaim = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new Error("No autenticado");
  
  const uid = data.uid; // User ID del admin
  await admin.auth().setCustomUserClaims(uid, { admin: true });
  return { message: "Admin claim asignado" };
});
```

3. Despliega con `firebase deploy --only functions`
4. Llama la función desde la consola o una página temporal

### Opción B: Firebase CLI
```bash
firebase auth:set-custom-claims <USER_ID> --custom-claims '{"admin":true}'
```

## 3. Configurar Firestore Rules (IMPORTANTE)

1. Ve a **Firestore Database** → **Rules**
2. Reemplaza todo con:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Lectura pública de productos
    match /productos/{id} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

3. Haz clic en **Publish**

**Esto significa:**
- Cualquiera puede VER productos
- Solo usuarios autenticados con `admin: true` pueden crear/editar/eliminar

## 4. Crear Colección `productos` (Si no existe)

1. Ve a **Firestore Database**
2. Si no ves la colección `productos`, haz clic en **Start collection**
3. Escribe `productos` como nombre
4. Haz clic en **Auto-generate ID** y añade un documento de ejemplo (o déjalo en blanco para crear vacío)

## 5. Probar Localmente

```bash
python -m http.server 5500
```

Abre `http://localhost:5500/admin.html` e ingresa:
- **Email:** `admin@zyloh.com`
- **Password:** `TuContraseña123!`

Si entras correctamente y puedes crear/editar/eliminar productos, ¡está funcionando!

## 6. Publicar en GitHub Pages

```bash
git add .
git commit -m "Integración Firebase Auth en admin"
git push origin main
```

Luego abre `https://tu-usuario.github.io/tu-repo/admin.html` e ingresa con tu email/password.

## Notas de Seguridad

- **Nunca publiques tu contraseña** en el código.
- **La contraseña se envía a Firebase vía HTTPS**, no al cliente.
- **El custom claim `admin` es verificado en el servidor** (Firestore), no en el navegador.
- Si pierdes acceso, puedes resetear la contraseña desde la consola de Firebase o crear otro usuario y asignarle el claim admin.

## Troubleshooting

| Problema | Solución |
|----------|----------|
| "Usuario no encontrado" | Verifica que creaste el usuario en Firebase Auth |
| "Contraseña incorrecta" | Revisa que ingresaste la contraseña correcta |
| "Missing or insufficient permissions" | Las Firestore rules aún permiten escritura a todos; revisa que están publicadas |
| No puedo crear/editar productos | Asegúrate de que el usuario tiene el custom claim `admin: true` |

## Estructura Final

```
zyloh/
├── index.html              (Storefront público)
├── producto.html           (Detalle de producto público)
├── admin.html              (Admin con Firebase Auth)
├── script.js               (Carga productos públicos)
├── admin.js                (Admin logic con Auth)
├── firebase.js             (Config y helpers)
├── style.css               (Estilos)
└── FIREBASE_SETUP.md       (Esta guía)
```
