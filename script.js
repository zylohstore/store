/* ===============================
   PRODUCTOS (Firestore)
================================ */
import { fetchProductos } from "./firebase.js";
let productos = [];

async function initProductos() {
  try {
    console.log("Cargando productos desde Firestore...");
    productos = await fetchProductos();
    console.log("Productos cargados:", productos.length, productos);
    renderProductosUI();
  } catch (err) {
    console.error("Error cargando productos desde Firebase:", err);
    console.log("Error completo:", JSON.stringify(err, null, 2));
    renderProductosUI(); // render empty gracefully
  }
}

/* ===============================
   MODO OSCURO / CLARO PERSISTENTE
================================ */
const botonModo = document.getElementById("modo");
const html = document.documentElement;

const temaGuardado = localStorage.getItem("tema");
if (temaGuardado) {
  html.setAttribute("data-theme", temaGuardado);
  if (botonModo) botonModo.textContent = temaGuardado === "dark" ? "☀️" : "🌙";
}

if (botonModo) {
  botonModo.onclick = () => {
    const nuevoTema =
      html.getAttribute("data-theme") === "light" ? "dark" : "light";
    html.setAttribute("data-theme", nuevoTema);
    localStorage.setItem("tema", nuevoTema);
    botonModo.textContent = nuevoTema === "dark" ? "☀️" : "🌙";
  };
}

/* ===============================
   FUNCION TARJETA PRODUCTO
================================ */
function productoHTML(p) {
  return `
    <a href="producto.html?id=${p.id}" class="producto fade">
      <img src="${p.imagenes[0]}">
      <h3>${p.nombre}</h3>
      <p>${p.precio}</p>
    </a>
  `;
}

/* ===============================
   DESTACADOS
================================ */
function renderDestacados() {
  const destacados = document.getElementById("destacados");
  if (!destacados) return;
  destacados.innerHTML = "";
  const destacadosArr = productos.filter((p) => p.destacado);
  console.log("Renderizando destacados:", destacadosArr.length);
  destacadosArr.forEach((p) => (destacados.innerHTML += productoHTML(p)));
}

/* ===============================
   CATÁLOGO
================================ */
function renderCatalogo() {
  const catalogo = document.getElementById("catalogo");
  if (!catalogo) return;
  catalogo.innerHTML = "";
  console.log("Renderizando catálogo:", productos.length, "productos");
  productos.forEach((p) => {
    catalogo.innerHTML += productoHTML(p);
  });
}

/* ===============================
   PÁGINA DE PRODUCTO
================================ */
function renderDetalle() {
  const detalle = document.getElementById("detalleProducto");
  if (!detalle) return;
  const id = new URLSearchParams(window.location.search).get("id");
  const p = productos.find(x => String(x.id) === String(id));

  if (!p) {
    detalle.innerHTML = `<p>Producto no encontrado.</p>`;
    return;
  }

  const mensaje = encodeURIComponent(`Hola, quiero el producto ${p.nombre}`);
  const link = `https://wa.me/523313856006?text=${mensaje}`;

  detalle.innerHTML = `
    <div class="galeria fade">
      <img id="principal" src="${p.imagenes[0]}">
      <div class="miniaturas">
        ${p.imagenes.map(img =>
          `<img src="${img}" onclick="document.getElementById('principal').src='${img}'">`
        ).join("")}
      </div>
    </div>

    <div class="info fade">
      <h1>${p.nombre}</h1>
      <p class="precio">${p.precio}</p>
      <p class="descripcion">${p.descripcion}</p>
      <a href="${link}" target="_blank" class="btn">Pedir producto</a>
    </div>
  `;
}

function renderProductosUI() {
  renderDestacados();
  renderCatalogo();
  renderDetalle();

  // Re-observe fade elements after rendering
  setTimeout(() => {
    document.querySelectorAll(".fade").forEach((el) => observer.observe(el));
  }, 100);
}

// Initialize data on load
initProductos();

/* ===============================
   ANIMACIONES TIPO APPLE (SCROLL)
================================ */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});

// Initial observation of existing fade elements
document.querySelectorAll(".fade").forEach(el => observer.observe(el));
