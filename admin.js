import { fetchProductos, upsertProducto, removeProducto } from "./firebase.js";

const PASSWORD = "zyloh123"; // 🔐 CAMBIA ESTA CONTRASEÑA

let productos = [];

// Form elements
const idProductoEl = document.getElementById("idProducto");
const nombreEl = document.getElementById("nombre");
const precioEl = document.getElementById("precio");
const descripcionEl = document.getElementById("descripcion");
const imagenesEl = document.getElementById("imagenes");
const destacadoEl = document.getElementById("destacado");
const btnEntrar = document.getElementById("btnEntrar");

function login() {
  const pass = document.getElementById("password").value;
  if (pass === PASSWORD) {
    document.getElementById("login").style.display = "none";
    document.getElementById("panel").style.display = "block";
    loadProductos();
  } else {
    alert("Contraseña incorrecta");
  }
}

// Bind login button click under module scope
if (btnEntrar) {
  btnEntrar.addEventListener("click", login);
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
window.login = login;
window.editar = editar;
window.eliminar = eliminar;
window.cancelarEdicion = cancelarEdicion;
