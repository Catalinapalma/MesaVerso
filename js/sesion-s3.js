/* ==========================================================
   MESAVERSO — SEMANA 3
   js/sesion-s3.js · Menú según el rol de la sesión ficticia

   Se carga en TODAS las páginas, después de datos-s3.js.
   Cada elemento del menú tiene un atributo data-rol que indica
   quién lo puede ver:
     data-rol="invitado"       -> nadie ha iniciado sesión
     data-rol="cliente"        -> solo el cliente
     data-rol="administrador"  -> solo el administrador
     data-rol="sesion"         -> cualquier persona que inició sesión

   Ocultar un enlace NO es seguridad real: solo cambia la interfaz.
   ========================================================== */


/* ==================== 1. MOSTRAR / OCULTAR OPCIONES DEL MENÚ ==================== */

// Decide si un elemento con data-rol debe verse para el rol actual.
function puedeVerse(rolElemento, rolActual) {
    if (rolElemento === "invitado") return rolActual === null;
    if (rolElemento === "sesion") return rolActual !== null;
    return rolElemento === rolActual; // "cliente" o "administrador"
}

// Recorre todos los elementos marcados con data-rol y cambia su atributo hidden.
function actualizarMenuPorRol() {
    const rolActual = MV.rol();

    document.querySelectorAll("[data-rol]").forEach(function (elemento) {
        elemento.hidden = !puedeVerse(elemento.dataset.rol, rolActual);
    });

    // Texto con el nombre y el rol de quien inició sesión.
    const textoSesion = document.getElementById("sesionActual");
    if (textoSesion && rolActual) {
        textoSesion.textContent = `${MV.nombre()} · ${rolActual}`;
    }
}


/* ==================== 2. CONTADOR DEL CARRITO ==================== */

// Escribe en el menú cuántas unidades hay en el carrito.
// Es global para que catalogo-s3.js y carrito-s3.js la llamen al cambiar algo.
function actualizarContadorCarrito() {
    const contador = document.getElementById("contadorCarrito");
    if (contador) {
        contador.textContent = MV.unidadesCarrito();
    }
}


/* ==================== 3. EVENTOS ==================== */

// Botón "SALIR": borra la sesión y vuelve a la tienda.
const botonSalir = document.getElementById("cerrarSesion");

if (botonSalir) {
    botonSalir.addEventListener("click", function () {
        MV.salir();
        window.location.href = "index.html";
    });
}

// Primera ejecución al cargar cada página.
actualizarMenuPorRol();
actualizarContadorCarrito();
