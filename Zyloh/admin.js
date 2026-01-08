const PASSWORD = "zyloh123"; // 🔐 CAMBIA ESTA CONTRASEÑA

let productos = JSON.parse(localStorage.getItem("productos")) || [];

function login() {
  const pass = document.getElementById("password").value;
  if (pass === PASSWORD) {
    document.getElementById("login").style.display = "none";
    document.getElementById("panel").style.display = "block";
    renderProductos();
  } else {
    alert("Contraseña incorrecta");
  }
}

/* ===============================
   FORMULARIO
================================ */
const form = document.getElementById("formProducto");

form.addEventListener("submit", e => {
  e.preventDefault();

  const id = document.getElementById("idProducto").value;

  const data = {
    id: id ? Number(id) : Date.now(),
    nombre: nombre.value,
    precio: precio.value,
    descripcion: descripcion.value,
    destacado: destacado.checked,
    imagenes: imagenes.value.split(",").map(i => i.trim())
  };

  if (id) {
    // EDITAR
    productos = productos.map(p => p.id == id ? data : p);
  } else {
    // NUEVO
    productos.push(data);
  }

  guardar();
  cancelarEdicion();
});

/* ===============================
   GUARDAR + RENDER
================================ */
function guardar() {
  localStorage.setItem("productos", JSON.stringify(productos));
  renderProductos();
}

function renderProductos() {
  const lista = document.getElementById("listaProductos");
  lista.innerHTML = "";

  productos.forEach(p => {
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
  const p = productos.find(p => p.id === id);

  idProducto.value = p.id;
  nombre.value = p.nombre;
  precio.value = p.precio;
  descripcion.value = p.descripcion;
  imagenes.value = p.imagenes.join(", ");
  destacado.checked = p.destacado;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ===============================
   CANCELAR
================================ */
function cancelarEdicion() {
  form.reset();
  idProducto.value = "";
}

/* ===============================
   ELIMINAR
================================ */
function eliminar(id) {
  if (confirm("¿Eliminar producto?")) {
    productos = productos.filter(p => p.id !== id);
    guardar();
  }
}
