/* ==========================================================
   MESAVERSO — SEMANA 2 (actualizado en SEMANA 3)
   js/inicio.js · "¿Qué jugamos hoy?" (solo en index.html)

   Al presionar el botón se CREA una tarjeta con un juego al azar
   (createElement + append). El botón "Quitar sugerencia" la
   ELIMINA del documento (remove).
   ========================================================== */


/* ==================== 1. DATOS: JUEGOS DEL CATÁLOGO ==================== */
// S3: antes los 12 juegos estaban escritos aquí. Ahora se leen de
// js/datos-s3.js, así la sugerencia incluye los juegos que agrega
// el administrador y no muestra los que elimina o están agotados.
// map() transforma cada producto al formato que usaba la Semana 2.

const juegos = MV.productos()
    .filter(function (producto) { return producto.stock > 0; })
    .map(function (producto) {
        return {
            nombre: producto.nombre,
            categoria: producto.categoria,
            pagina: producto.categoria.toLowerCase() + ".html",
            imagen: producto.imagen,
            texto: producto.descripcion
        };
    });


/* ==================== 2. ELEMENTOS DEL DOM ==================== */

const btnSugerir = document.getElementById("btnSugerir");
const btnQuitar = document.getElementById("btnQuitarSugerencia");
const zonaSugerencia = document.getElementById("zonaSugerencia");

let ultimoIndice = -1; // para no repetir el mismo juego dos veces seguidas


/* ==================== 3. FUNCIONES ==================== */

function elegirJuegoAlAzar() {
    // S3: con un solo juego disponible no se puede evitar repetirlo
    if (juegos.length === 1) return juegos[0];

    let indice;
    do {
        indice = Math.floor(Math.random() * juegos.length);
    } while (indice === ultimoIndice);

    ultimoIndice = indice;
    return juegos[indice];
}

// Construye la tarjeta elemento por elemento
function crearTarjeta(juego) {
    const tarjeta = document.createElement("article");
    tarjeta.classList.add("suggestion-card");

    const imagen = document.createElement("img");
    imagen.src = juego.imagen;
    imagen.alt = "Ilustración de " + juego.nombre;

    const info = document.createElement("div");
    info.classList.add("suggestion-info");

    const etiqueta = document.createElement("span");
    etiqueta.classList.add("eyebrow");
    etiqueta.textContent = "HOY TE RECOMENDAMOS · " + juego.categoria.toUpperCase();

    const titulo = document.createElement("h3");
    titulo.textContent = juego.nombre;

    const descripcion = document.createElement("p");
    descripcion.textContent = juego.texto;

    const enlace = document.createElement("a");
    enlace.href = juego.pagina;
    enlace.textContent = "Ver en " + juego.categoria + " →";

    info.append(etiqueta, titulo, descripcion, enlace);
    tarjeta.append(imagen, info);

    return tarjeta;
}

function quitarSugerencia() {
    const tarjetaAnterior = zonaSugerencia.querySelector(".suggestion-card");
    if (tarjetaAnterior) {
        tarjetaAnterior.remove();
    }
}


/* ==================== 4. EVENTOS ==================== */

btnSugerir.addEventListener("click", function () {
    // S3: si el administrador dejó todo sin stock, no hay nada que sugerir
    if (juegos.length === 0) {
        btnSugerir.textContent = "Sin juegos disponibles por ahora";
        return;
    }

    quitarSugerencia();                              // elimina la anterior (si hay)
    zonaSugerencia.append(crearTarjeta(elegirJuegoAlAzar()));

    btnSugerir.textContent = "🎲 Sugerir otro juego"; // cambia el texto del botón
    btnQuitar.hidden = false;                       // muestra el botón "Quitar"
});

btnQuitar.addEventListener("click", function () {
    quitarSugerencia();

    btnSugerir.textContent = "🎲 Sugerir un juego";
    btnQuitar.hidden = true;
});
