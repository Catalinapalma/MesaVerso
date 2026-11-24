/* ==========================================================
   MESAVERSO — SEMANA 2
   js/catalogo.js · Buscador de juegos

   Se usa en estrategia, familiares, cartas, cooperativos y ofertas.
   Mientras se escribe, oculta las fichas cuyo nombre no coincide.
   No borra las fichas del HTML: utiliza la clase d-none
    de Bootstrap para ocultarlas o mostrarlas.

   S3: las columnas ahora se buscan DENTRO de filtrarJuegos(), porque
   catalogo-s3.js puede quitar o crear fichas después de cargar la página.
   ========================================================== */


const buscador = document.getElementById("buscarJuego");
const resultadoBusqueda = document.getElementById("resultadoBusqueda");


// Pasa a minúsculas y quita tildes: "Pandémic" -> "pandemic"
function normalizar(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "");
}

function filtrarJuegos() {
    const busqueda = normalizar(buscador.value.trim());
    let visibles = 0;

    // Cada ficha está dentro de una columna Bootstrap (div.col-...).
    // S3: se consulta cada vez para incluir las fichas creadas por catalogo-s3.js.
    const columnas = document.querySelectorAll(".game-grid > div");

    columnas.forEach(function (columna) {
        const nombreJuego = normalizar(columna.querySelector("h3").textContent);
        const coincide = nombreJuego.includes(busqueda);

        columna.classList.toggle("d-none", !coincide);
        if (coincide) visibles++;
    });

    // Mensaje dinámico con el resultado
    if (visibles === 0) {
        resultadoBusqueda.textContent = "No encontramos juegos con ese nombre.";
        resultadoBusqueda.classList.add("empty");
    } else {
        resultadoBusqueda.textContent = `Mostrando ${visibles} de ${columnas.length} juegos.`;
        resultadoBusqueda.classList.remove("empty");
    }
}

buscador.addEventListener("input", filtrarJuegos);

filtrarJuegos(); // Primera ejecución al cargar la página
