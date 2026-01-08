/* ===============================
   PRODUCTOS (ADMIN + RESPALDO)
================================ */
const productos = JSON.parse(localStorage.getItem("productos")) || [
  {
    id: 1,
    nombre: "Zyloh One",
    precio: "$999 MXN",
    destacado: true,
    descripcion: "Minimalismo absoluto con potencia premium.",
    imagenes: [
      "https://via.placeholder.com/500",
      "https://via.placeholder.com/500/999999"
    ]
  },
  {
    id: 2,
    nombre: "Zyloh Pro",
    precio: "$1,299 MXN",
    destacado: true,
    descripcion: "Diseñado para los que exigen más.",
    imagenes: [
      "https://via.placeholder.com/500",
      "https://via.placeholder.com/500/777777"
    ]
  },
  {
    id: 3,
    nombre: "Zyloh Air",
    precio: "$799 MXN",
    destacado: false,
    descripcion: "Ligero, elegante y poderoso.",
    imagenes: [
      "https://via.placeholder.com/500"
    ]
  }
];

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
const destacados = document.getElementById("destacados");
if (destacados) {
  productos
    .filter(p => p.destacado)
    .forEach(p => destacados.innerHTML += productoHTML(p));
}

/* ===============================
   CATÁLOGO
================================ */
const catalogo = document.getElementById("catalogo");
if (catalogo) {
  productos.forEach(p => {
    catalogo.innerHTML += productoHTML(p);
  });
}

/* ===============================
   PÁGINA DE PRODUCTO
================================ */
const detalle = document.getElementById("detalleProducto");
if (detalle) {
  const id = new URLSearchParams(window.location.search).get("id");
  const p = productos.find(x => x.id == id);

  if (p) {
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
}

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

document.querySelectorAll(".fade").forEach(el => observer.observe(el));
