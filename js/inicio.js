/* ==========================================================
   MESAVERSO — SEMANA 2
   js/inicio.js · "¿Qué jugamos hoy?" (solo en index.html)

   Al presionar el botón se CREA una tarjeta con un juego al azar
   (createElement + append). El botón "Quitar sugerencia" la
   ELIMINA del documento (remove).
   ========================================================== */


/* ==================== 1. DATOS: JUEGOS DEL CATÁLOGO ==================== */

const juegos = [
    { nombre: "Catan",           categoria: "Estrategia",   pagina: "estrategia.html",   imagen: "img/catan.png",       texto: "Comercia, construye y desarrolla asentamientos." },
    { nombre: "Ticket to Ride",  categoria: "Estrategia",   pagina: "estrategia.html",   imagen: "img/ticket.png",      texto: "Conecta ciudades y completa rutas ferroviarias." },
    { nombre: "Ajedrez Clásico", categoria: "Estrategia",   pagina: "estrategia.html",   imagen: "img/ajedrez.png",     texto: "Anticipa cada movimiento para lograr el jaque mate." },
    { nombre: "Dixit",           categoria: "Familiares",   pagina: "familiares.html",   imagen: "img/dixit.png",       texto: "Imaginación y pistas para toda la familia." },
    { nombre: "Carcassonne",     categoria: "Familiares",   pagina: "familiares.html",   imagen: "img/carcassonne.png", texto: "Crea paisajes y suma puntos con tus fichas." },
    { nombre: "Aventureros",     categoria: "Familiares",   pagina: "familiares.html",   imagen: "img/aventureros.png", texto: "Explora caminos y cumple desafíos en grupo." },
    { nombre: "UNO",             categoria: "Cartas",       pagina: "cartas.html",       imagen: "img/uno.png",         texto: "Descarta tus cartas antes que los demás." },
    { nombre: "Dobble",          categoria: "Cartas",       pagina: "cartas.html",       imagen: "img/dobble.png",      texto: "Encuentra el símbolo repetido contra el reloj." },
    { nombre: "Virus!",          categoria: "Cartas",       pagina: "cartas.html",       imagen: "img/virus.png",       texto: "Reúne órganos sanos y evita contagios." },
    { nombre: "Pandemic",        categoria: "Cooperativos", pagina: "cooperativos.html", imagen: "img/pandemic.png",    texto: "Colaboren para detener brotes por el mundo." },
    { nombre: "Just One",        categoria: "Cooperativos", pagina: "cooperativos.html", imagen: "img/justone.png",     texto: "Den pistas únicas para adivinar palabras." },
    { nombre: "La misión azul",  categoria: "Cooperativos", pagina: "cooperativos.html", imagen: "img/azul.png",        texto: "Resuelvan juntos desafíos por turnos." }
];


/* ==================== 2. ELEMENTOS DEL DOM ==================== */

const btnSugerir = document.getElementById("btnSugerir");
const btnQuitar = document.getElementById("btnQuitarSugerencia");
const zonaSugerencia = document.getElementById("zonaSugerencia");

let ultimoIndice = -1; // para no repetir el mismo juego dos veces seguidas


/* ==================== 3. FUNCIONES ==================== */

function elegirJuegoAlAzar() {
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
