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

  // Persist in Firestore
  await upsertProducto(data);
  await loadProductos();
  cancelarEdicion();
});

/* ===============================
   GUARDAR + RENDER
================================ */
async function loadProductos() {
  productos = await fetchProductos();
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
