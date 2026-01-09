import {
  fetchProductos,
  upsertProducto,
  removeProducto,
  loginAdmin,
  logoutAdmin,
  onAuthChange,
  auth,
} from "./firebase.js";

let productos = [];
let currentUser = null;

// Form elements
const idProductoEl = document.getElementById("idProducto");
const nombreEl = document.getElementById("nombre");
const precioEl = document.getElementById("precio");
const descripcionEl = document.getElementById("descripcion");
const imagenesEl = document.getElementById("imagenes");
const destacadoEl = document.getElementById("destacado");
const btnEntrar = document.getElementById("btnEntrar");
const btnSalir = document.getElementById("btnSalir");
const emailEl = document.getElementById("email");
const passwordEl = document.getElementById("password");
const authErrorEl = document.getElementById("authError");

// Monitor auth state
onAuthChange((user) => {
  currentUser = user;
  if (user) {
    console.log("Usuario autenticado:", user.email);
    document.getElementById("login").style.display = "none";
    document.getElementById("panel").style.display = "block";
    loadProductos();
  } else {
    console.log("Usuario desautenticado");
    document.getElementById("login").style.display = "block";
    document.getElementById("panel").style.display = "none";
    emailEl.value = "";
    passwordEl.value = "";
    authErrorEl.style.display = "none";
    authErrorEl.textContent = "";
  }
});

async function login() {
  const email = emailEl.value.trim();
  const password = passwordEl.value.trim();

  if (!email || !password) {
    authErrorEl.textContent = "Completa email y contraseña";
    authErrorEl.style.display = "block";
    return;
  }

  btnEntrar.disabled = true;
  btnEntrar.textContent = "Entrando...";

  try {
    console.log("Intentando login con:", email);
    await loginAdmin(email, password);
    console.log("Login exitoso");
    // Auth state change will handle UI
  } catch (err) {
    console.error("Error de login - Code:", err.code, "Message:", err.message);
    console.log("JSON del error:", JSON.stringify(err, null, 2));
    
    let msgError = err.message;
    if (err.code === "auth/user-not-found") {
      msgError = "Usuario no encontrado";
    } else if (err.code === "auth/wrong-password") {
      msgError = "Contraseña incorrecta";
    } else if (err.code === "auth/invalid-email") {
      msgError = "Email inválido";
    } else if (err.code === "auth/too-many-requests") {
      msgError = "Demasiados intentos fallidos. Intenta más tarde.";
    }
    
    authErrorEl.textContent = `Error: ${msgError}`;
    authErrorEl.style.display = "block";
  } finally {
    btnEntrar.disabled = false;
    btnEntrar.textContent = "Entrar";
  }
}

async function logout() {
  try {
    await logoutAdmin();
  } catch (err) {
    console.error("Error al salir:", err);
    alert("Error al salir: " + err.message);
  }
}

// Bind buttons
if (btnEntrar) {
  btnEntrar.addEventListener("click", login);
}
if (btnSalir) {
  btnSalir.addEventListener("click", logout);
}

/* ===============================
   FORMULARIO
================================ */
const form = document.getElementById("formProducto");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = idProductoEl.value;

  const data = {
    id: id ? Number(id) : Date.now(),
    nombre: nombreEl.value,
    precio: precioEl.value,
    descripcion: descripcionEl.value,
    destacado: destacadoEl.checked,
    imagenes: imagenesEl.value.split(",").map((i) => i.trim()),
  };

  // Persist in Firestore with UI feedback
  const saveBtn = form.querySelector('button[type="submit"]');
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.textContent = "Guardando...";
  }

  try {
    await upsertProducto(data);
    await loadProductos();
    cancelarEdicion();
  } catch (err) {
    console.error("Error al guardar en Firebase:", err);
    alert(
      "Error al guardar en Firebase: " +
        (err && err.message ? err.message : err)
    );
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = "Guardar producto";
    }
  }
});

/* ===============================
   GUARDAR + RENDER
================================ */
async function loadProductos() {
  try {
    productos = await fetchProductos();
  } catch (err) {
    console.error("Error cargando productos desde Firebase:", err);
    alert(
      "Error cargando productos desde Firebase: " +
        (err && err.message ? err.message : err)
    );
    productos = [];
  }
  renderProductos();
}

function renderProductos() {
  const lista = document.getElementById("listaProductos");
  lista.innerHTML = "";

  productos.forEach((p) => {
    lista.innerHTML += `
      <div class="producto-admin">
        <div>
          <strong>${p.nombre}</strong><br>
          <small>${p.precio}</small>
        </div>
        <div>
          <button onclick="editar(${p.id})">Editar</button>
          <button onclick="eliminar(${p.id})">Eliminar</button>
        </div>
      </div>
    `;
  });
}

/* ===============================
   EDITAR
================================ */
function editar(id) {
  const p = productos.find((p) => p.id === id);

  idProductoEl.value = p.id;
  nombreEl.value = p.nombre;
  precioEl.value = p.precio;
  descripcionEl.value = p.descripcion;
  imagenesEl.value = p.imagenes.join(", ");
  destacadoEl.checked = p.destacado;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ===============================
   CANCELAR
================================ */
function cancelarEdicion() {
  form.reset();
  idProductoEl.value = "";
}

/* ===============================
   ELIMINAR
================================ */
async function eliminar(id) {
  if (confirm("¿Eliminar producto?")) {
    await removeProducto(id);
    await loadProductos();
  }
}

// Expose functions for inline onclick handlers (module scope is not global)
window.editar = editar;
window.eliminar = eliminar;
window.cancelarEdicion = cancelarEdicion;
