/* ==========================================================
   MESAVERSO — SEMANA 2
   js/main.js · Funciones comunes a todas las páginas

   - Marca en el menú la sección en la que está la persona.
   - Escribe automáticamente el año actual en el pie de página.
   - Agrega una sombra al menú cuando se hace scroll.
   ========================================================== */


/* ==================== 1. ENLACE ACTIVO DEL MENÚ ==================== */
// Las páginas de cada categoría pertenecen a la sección "CATEGORÍAS".

const paginasDeCategorias = [
    "estrategia.html",
    "familiares.html",
    "cartas.html",
    "cooperativos.html"
];

// Nombre del archivo actual. Ej: ".../MesaVerso/ofertas.html" -> "ofertas.html"
let paginaActual = window.location.pathname.split("/").pop() || "index.html";

if (paginasDeCategorias.includes(paginaActual)) {
    paginaActual = "categorias.html";
}

document.querySelectorAll(".top-nav .nav-link").forEach(function (enlace) {
    if (enlace.getAttribute("href") === paginaActual) {
        enlace.classList.add("active");                 // cambia el estilo (CSS)
        enlace.setAttribute("aria-current", "page");    // cambia un atributo HTML
    }
});


/* ==================== 2. AÑO ACTUAL EN EL FOOTER ==================== */

const anioActual = document.getElementById("anio-actual");

if (anioActual) {
    anioActual.textContent = new Date().getFullYear();
}


/* ==================== 3. SOMBRA DEL MENÚ AL HACER SCROLL ==================== */

const menu = document.querySelector(".top-nav");

window.addEventListener("scroll", function () {
    menu.classList.toggle("is-scrolled", window.scrollY > 40);
});
