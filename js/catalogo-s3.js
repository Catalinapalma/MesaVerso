/* ==========================================================
   MESAVERSO — SEMANA 3
   js/catalogo-s3.js · Catálogo conectado a los datos + carrito

   Se usa en estrategia, familiares, cartas, cooperativos y ofertas.
   La página indica qué mostrar con <body data-categoria="...">.

   CONTINUIDAD CON S1/S2: las 12 fichas siguen escritas en el HTML.
   Este archivo NO las reemplaza; las relaciona con los datos de
   datos-s3.js para que los cambios del administrador se vean:
   1. Actualiza nombre, descripción, precio e imagen de cada ficha.
   2. Quita las fichas de juegos eliminados o movidos de categoría.
   3. Crea fichas nuevas para los juegos agregados desde admin.html.
   4. Agrega a cada ficha su stock y el botón según el rol:
        cliente       -> "Agregar al carrito"
        invitado      -> "Ingresa para comprar" (lleva al login)
        administrador -> "Editar en el panel"
   ========================================================== */

const rejillaJuegos = document.querySelector(".game-grid");
const categoriaPagina = document.body.dataset.categoria; // "Estrategia", "Ofertas"...

// Solo se ejecuta en las páginas que tienen rejilla de juegos
if (rejillaJuegos && categoriaPagina) {

    /* ==================== 1. DATOS ==================== */

    const productosActuales = MV.productos();
    const productosOriginales = MV.originales();
    const idsMostrados = [];

    // Zona de avisos: se crea con JavaScript justo antes de la rejilla
    const avisoCarrito = document.createElement("p");
    avisoCarrito.id = "avisoCarrito";
    avisoCarrito.className = "cart-notice";
    avisoCarrito.setAttribute("role", "status");
    avisoCarrito.setAttribute("aria-live", "polite");
    rejillaJuegos.before(avisoCarrito);


    /* ==================== 2. FUNCIONES ==================== */

    // ¿Este producto debe aparecer en esta página?
    // En "Ofertas" se muestran todos los que tienen precio de oferta.
    function perteneceAPagina(producto) {
        if (categoriaPagina === "Ofertas") return Boolean(producto.precioOferta);
        return producto.categoria === categoriaPagina;
    }

    // Vuelve a construir la línea de precios con el mismo HTML de la Semana 1
    function pintarPrecio(contenedor, producto) {
        contenedor.replaceChildren(); // borra el contenido anterior

        const prices = document.createElement("div");
        prices.className = "prices";

        if (producto.precioOferta) {
            const etiqueta = document.createElement("span");
            etiqueta.className = "discount";
            etiqueta.textContent = "-" + MV.descuento(producto) + "%";

            const anterior = document.createElement("span");
            anterior.className = "old-price";
            anterior.textContent = MV.moneda(producto.precio);

            const actual = document.createElement("strong");
            actual.textContent = MV.moneda(producto.precioOferta);

            prices.append(anterior, actual);
            contenedor.append(etiqueta, prices);
        } else {
            const etiqueta = document.createElement("span");
            etiqueta.className = "no-discount";
            etiqueta.textContent = "Sin descuento";

            const actual = document.createElement("strong");
            actual.textContent = MV.moneda(producto.precio);

            prices.append(actual);
            contenedor.append(etiqueta, prices);
        }
    }

    // Etiqueta "-20%" sobre la imagen: se crea, actualiza o elimina
    function pintarEtiquetaImagen(cover, producto) {
        let etiqueta = cover.querySelector(".cover-sale");

        if (producto.precioOferta) {
            if (!etiqueta) {
                etiqueta = document.createElement("span");
                etiqueta.className = "cover-sale";
                cover.append(etiqueta);
            }
            etiqueta.textContent = "-" + MV.descuento(producto) + "%";
        } else if (etiqueta) {
            etiqueta.remove();
        }
    }

    // Unidades de un producto que ya están en el carrito
    function unidadesEnCarrito(id) {
        const item = MV.carrito().find(function (i) { return i.id === id; });
        return item ? item.cantidad : 0;
    }

    // Texto y color del stock disponible
    function pintarStock(etiqueta, producto) {
        const disponible = producto.stock - unidadesEnCarrito(producto.id);

        etiqueta.classList.remove("pocas", "agotado");

        if (producto.stock === 0) {
            etiqueta.textContent = "Agotado";
            etiqueta.classList.add("agotado");
        } else if (producto.stock <= 3) {
            etiqueta.textContent = `¡Últimas ${producto.stock} unidades!`;
            etiqueta.classList.add("pocas");
        } else {
            etiqueta.textContent = `Stock: ${producto.stock} unidades`;
        }
        return disponible;
    }

    // Agrega una unidad al carrito, respetando el stock
    function agregarAlCarrito(producto, boton, etiquetaStock) {
        const carrito = MV.carrito();
        const item = carrito.find(function (i) { return i.id === producto.id; });
        const enCarrito = item ? item.cantidad : 0;

        if (enCarrito >= producto.stock) {
            avisoCarrito.textContent = `No hay más stock de ${producto.nombre}: ya tienes ${enCarrito} en el carrito.`;
            avisoCarrito.classList.add("error");
            return;
        }

        // Si ya estaba, se suma 1; si no, se agrega un objeto nuevo
        if (item) {
            item.cantidad++;
        } else {
            carrito.push({ id: producto.id, cantidad: 1 });
        }
        MV.guardar("carrito", carrito);

        avisoCarrito.classList.remove("error");
        avisoCarrito.textContent =
            `✓ ${producto.nombre} agregado al carrito (${enCarrito + 1} en total). ` +
            `Llevas ${MV.unidadesCarrito()} producto(s).`;

        actualizarContadorCarrito(); // función de sesion-s3.js

        // Si ya no queda stock disponible, se desactiva el botón
        const disponible = pintarStock(etiquetaStock, producto);
        if (disponible <= 0) {
            boton.disabled = true;
            boton.textContent = "Sin stock disponible";
        }
    }

    // Crea la línea de stock + botón según el rol
    function agregarAcciones(ficha, producto) {
        const info = ficha.querySelector(".game-info");

        // Si la ficha ya tenía acciones (no debería), se reemplazan
        const anterior = info.querySelector(".stock-line");
        if (anterior) anterior.remove();

        const linea = document.createElement("div");
        linea.className = "stock-line";

        const etiquetaStock = document.createElement("span");
        etiquetaStock.className = "stock-badge";
        const disponible = pintarStock(etiquetaStock, producto);

        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "btn-cart";

        const rol = MV.rol();

        if (rol === "administrador") {
            // El administrador no compra: va al panel a editar el producto
            boton.textContent = "Editar en el panel";
            boton.classList.add("secundario");
            boton.addEventListener("click", function () {
                window.location.href = "admin.html?editar=" + producto.id;
            });
        } else if (rol === "cliente") {
            boton.textContent = disponible > 0 ? "Agregar al carrito" : "Sin stock disponible";
            boton.disabled = disponible <= 0;
            boton.addEventListener("click", function () {
                agregarAlCarrito(producto, boton, etiquetaStock);
            });
        } else {
            // Invitado: primero debe iniciar sesión y luego vuelve a esta página
            boton.textContent = "Ingresa para comprar";
            boton.classList.add("secundario");
            boton.disabled = producto.stock === 0;
            boton.addEventListener("click", function () {
                const pagina = window.location.pathname.split("/").pop() || "index.html";
                window.location.href = "login.html?volver=" + pagina;
            });
        }

        linea.append(etiquetaStock, boton);
        info.append(linea);
    }

    // Actualiza una ficha que ya existía en el HTML con los datos actuales
    function actualizarFicha(ficha, producto) {
        ficha.querySelector("h3").textContent = producto.nombre;

        const descripcion = ficha.querySelector(".game-info > p");
        if (descripcion) descripcion.textContent = producto.descripcion;

        const imagen = ficha.querySelector(".cover img");
        imagen.src = producto.imagen;
        imagen.alt = "Ilustración de " + producto.nombre;

        pintarEtiquetaImagen(ficha.querySelector(".cover"), producto);
        pintarPrecio(ficha.querySelector(".price-line"), producto);
        agregarAcciones(ficha, producto);
    }

    // Crea una ficha nueva con la misma estructura HTML de las originales
    function crearFicha(producto) {
        const columna = document.createElement("div");
        columna.className = "col-12 col-md-6 col-lg-4";

        const ficha = document.createElement("article");
        ficha.className = "game-card h-100";

        const cover = document.createElement("div");
        cover.className = "cover";
        const imagen = document.createElement("img");
        imagen.width = 960;
        imagen.height = 540;
        imagen.loading = "lazy";
        cover.append(imagen);

        const info = document.createElement("div");
        info.className = "game-info";
        const titulo = document.createElement("h3");
        const descripcion = document.createElement("p");
        const precio = document.createElement("div");
        precio.className = "price-line";
        info.append(titulo, descripcion, precio);

        ficha.append(cover, info);
        columna.append(ficha);
        rejillaJuegos.append(columna);

        actualizarFicha(ficha, producto);
    }


    /* ==================== 3. RECORRER LAS FICHAS DEL HTML ==================== */

    rejillaJuegos.querySelectorAll("article.game-card").forEach(function (ficha) {
        const nombreHTML = ficha.querySelector("h3").textContent.trim();

        // 3.1 ¿A qué producto original corresponde esta ficha?
        const original = productosOriginales.find(function (p) { return p.nombre === nombreHTML; });
        if (!original) return;

        // 3.2 ¿Sigue existiendo y pertenece a esta página?
        const actual = productosActuales.find(function (p) { return p.id === original.id; });
        const columna = ficha.parentElement;

        if (!actual || !perteneceAPagina(actual)) {
            columna.remove(); // eliminado o movido por el administrador
            return;
        }

        idsMostrados.push(actual.id);
        actualizarFicha(ficha, actual);
    });


    /* ==================== 4. CREAR FICHAS NUEVAS ==================== */
    // Productos agregados desde admin.html o que cambiaron a esta categoría

    productosActuales
        .filter(function (p) { return perteneceAPagina(p) && !idsMostrados.includes(p.id); })
        .forEach(crearFicha);


    /* ==================== 5. BUSCADOR DE LA SEMANA 2 ==================== */
    // Se vuelve a ejecutar para que cuente también las fichas nuevas.
    if (typeof filtrarJuegos === "function") {
        filtrarJuegos();
    }
}
