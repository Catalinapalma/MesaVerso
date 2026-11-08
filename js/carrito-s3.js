/* ==========================================================
   MESAVERSO — SEMANA 3
   js/carrito-s3.js · Carrito de compras y pago simulado (carrito.html)

   Se practica: arreglos de objetos, find(), map(), filter(), reduce(),
   createElement, eventos y localStorage.

   El carrito se guarda como: [{ id: 1, cantidad: 2 }, { id: 4, cantidad: 1 }]
   Al confirmar:
   1. Se valida el formulario de despacho y pago.
   2. Se vuelve a revisar el stock de cada producto.
   3. Se crea un pedido asociado al correo del cliente.
   4. Se DESCUENTA el stock del inventario.
   5. Se vacía el carrito y se va a confirmacion.html.

   No se procesa ningún pago real.
   ========================================================== */

// Solo el rol cliente puede comprar
if (MV.exigir(["cliente"])) {

    /* ==================== 1. ELEMENTOS DEL DOM ==================== */

    const listaCarrito = document.getElementById("listaCarrito");
    const estadoCarrito = document.getElementById("estadoCarrito");
    const resumenUnidades = document.getElementById("resumenUnidades");
    const resumenTotal = document.getElementById("resumenTotal");
    const btnVaciar = document.getElementById("btnVaciar");
    const btnPagar = document.getElementById("btnPagar");
    const formPago = document.getElementById("formPago");
    const mensajePago = document.getElementById("mensajePago");


    /* ==================== 2. REGLAS DEL FORMULARIO DE PAGO ==================== */

    const reglasPago = {
        pagoDireccion: function (valor) {
            return Validaciones.validarDireccion(valor, true); // obligatoria
        },
        pagoMetodo: function (valor) {
            return Validaciones.validarOpcion(
                valor,
                ["Débito (simulado)", "Crédito (simulado)", "Transferencia (simulada)"],
                "un medio de pago"
            );
        },
        // Un checkbox no tiene "value" útil: se revisa la propiedad checked
        pagoTerminos: function () {
            return document.getElementById("pagoTerminos").checked
                ? ""
                : "Debes aceptar que es una compra de demostración.";
        }
    };


    /* ==================== 3. FUNCIONES DE CÁLCULO ==================== */

    // Une cada item del carrito con los datos del producto.
    // Si el administrador eliminó un producto, ese item se descarta (filter).
    function detalleCarrito() {
        const productos = MV.productos();

        return MV.carrito()
            .map(function (item) {
                const producto = productos.find(function (p) { return p.id === item.id; });
                if (!producto) return null;
                return {
                    producto: producto,
                    cantidad: item.cantidad,
                    precio: MV.precioFinal(producto),
                    subtotal: MV.precioFinal(producto) * item.cantidad
                };
            })
            .filter(Boolean);
    }

    // Suma los subtotales con reduce() para obtener el total a pagar
    function calcularTotal(detalle) {
        return detalle.reduce(function (total, linea) { return total + linea.subtotal; }, 0);
    }

    // Cambia la cantidad de un producto (+1 o -1) y guarda el carrito
    function cambiarCantidad(id, cambio) {
        const carrito = MV.carrito();
        const item = carrito.find(function (i) { return i.id === id; });
        if (!item) return;

        item.cantidad += cambio;

        // Si llega a 0 se quita del carrito
        const actualizado = carrito.filter(function (i) { return i.cantidad > 0; });
        MV.guardar("carrito", actualizado);
        mostrarCarrito();
    }

    // Quita por completo un producto del carrito
    function quitarProducto(id) {
        const restantes = MV.carrito().filter(function (i) { return i.id !== id; });
        MV.guardar("carrito", restantes);
        mostrarCarrito();
    }


    /* ==================== 4. DIBUJAR EL CARRITO ==================== */

    // Crea un botón con su texto y su evento (evita repetir código)
    function crearBoton(texto, clase, etiqueta, accion) {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = clase;
        boton.textContent = texto;
        boton.setAttribute("aria-label", etiqueta);
        boton.addEventListener("click", accion);
        return boton;
    }

    // Crea el <li> de un producto con imagen, cantidad y botones
    function crearLinea(linea) {
        const p = linea.producto;

        const item = document.createElement("li");
        item.className = "cart-item";

        const imagen = document.createElement("img");
        imagen.src = p.imagen;
        imagen.alt = "Ilustración de " + p.nombre;

        const info = document.createElement("div");
        info.className = "cart-item-info";
        const titulo = document.createElement("h3");
        titulo.textContent = p.nombre;
        const detalle = document.createElement("p");
        detalle.textContent = `${p.categoria} · ${MV.moneda(linea.precio)} c/u · Stock: ${p.stock}`;
        info.append(titulo, detalle);

        // Controles − cantidad +
        const control = document.createElement("div");
        control.className = "qty-control";
        const menos = crearBoton("−", "", "Quitar una unidad de " + p.nombre, function () {
            cambiarCantidad(p.id, -1);
        });
        const cantidad = document.createElement("span");
        cantidad.textContent = linea.cantidad;
        const mas = crearBoton("+", "", "Agregar una unidad de " + p.nombre, function () {
            cambiarCantidad(p.id, 1);
        });
        mas.disabled = linea.cantidad >= p.stock; // no se puede superar el stock
        control.append(menos, cantidad, mas);

        const total = document.createElement("span");
        total.className = "cart-item-total";
        total.textContent = MV.moneda(linea.subtotal);

        const quitar = crearBoton("Quitar", "btn-remove", "Quitar " + p.nombre + " del carrito", function () {
            quitarProducto(p.id);
        });

        item.append(imagen, info, control, total, quitar);
        return item;
    }

    // Vuelve a dibujar todo el carrito cada vez que cambia
    function mostrarCarrito() {
        const detalle = detalleCarrito();
        listaCarrito.replaceChildren(); // borra la versión anterior

        if (detalle.length === 0) {
            const vacio = document.createElement("li");
            vacio.className = "empty-state";
            vacio.textContent = "Tu carrito está vacío. Explora las categorías para agregar juegos.";
            listaCarrito.append(vacio);
        } else {
            detalle.forEach(function (linea) {
                listaCarrito.append(crearLinea(linea));
            });
        }

        const unidades = detalle.reduce(function (t, l) { return t + l.cantidad; }, 0);
        const total = calcularTotal(detalle);

        estadoCarrito.textContent = unidades
            ? `${unidades} producto(s) en el carrito.`
            : "No hay productos seleccionados.";

        resumenUnidades.textContent = unidades;
        resumenTotal.textContent = MV.moneda(total);

        btnPagar.disabled = detalle.length === 0;
        btnVaciar.disabled = detalle.length === 0;

        actualizarContadorCarrito(); // contador del menú (sesion-s3.js)
    }


    /* ==================== 5. CONFIRMAR LA COMPRA ==================== */

    // Revisa que ningún producto supere el stock actual.
    // Devuelve el nombre del primer producto con problema, o "".
    function revisarStock(detalle) {
        const sinStock = detalle.find(function (l) { return l.cantidad > l.producto.stock; });
        return sinStock ? sinStock.producto.nombre : "";
    }

    function confirmarCompra() {
        const detalle = detalleCarrito();

        // 5.1 Crear el pedido asociado al cliente
        const pedidos = MV.pedidos();
        const pedido = {
            id: MV.siguienteId(pedidos),
            correo: MV.correo(),
            cliente: MV.nombre(),
            items: detalle.map(function (l) {
                return { id: l.producto.id, nombre: l.producto.nombre, cantidad: l.cantidad, precio: l.precio };
            }),
            total: calcularTotal(detalle),
            fecha: new Date().toISOString().slice(0, 10),
            estado: "Pagado (simulado)",
            despacho: document.getElementById("pagoDireccion").value.trim(),
            pago: document.getElementById("pagoMetodo").value
        };
        pedidos.push(pedido);
        MV.guardar("pedidos", pedidos);

        // 5.2 Descontar el stock del inventario
        const productos = MV.productos();
        detalle.forEach(function (linea) {
            const producto = productos.find(function (p) { return p.id === linea.producto.id; });
            producto.stock -= linea.cantidad;
        });
        MV.guardar("productos", productos);

        // 5.3 Vaciar el carrito y recordar el pedido para la confirmación
        MV.guardar("carrito", []);
        MV.guardar("ultimoPedido", pedido.id);

        window.location.href = "confirmacion.html";
    }


    /* ==================== 6. EVENTOS ==================== */

    Formulario.validarEnVivo({ pagoDireccion: reglasPago.pagoDireccion, pagoMetodo: reglasPago.pagoMetodo });

    // 6.1 El checkbox se vuelve a validar al marcarlo o desmarcarlo
    document.getElementById("pagoTerminos").addEventListener("change", function () {
        Formulario.pintarCampo(this, reglasPago.pagoTerminos());
    });

    // 6.2 Botón "Vaciar carrito"
    btnVaciar.addEventListener("click", function () {
        MV.guardar("carrito", []);
        mostrarCarrito();
        Formulario.mostrarEstado(mensajePago, "Se vació el carrito.", "exito");
    });

    // 6.3 Enviar el formulario de pago
    formPago.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const detalle = detalleCarrito();
        if (detalle.length === 0) {
            Formulario.mostrarEstado(mensajePago, "Agrega al menos un producto antes de pagar.", "error");
            return;
        }

        if (!Formulario.validarTodo(reglasPago)) {
            Formulario.mostrarEstado(mensajePago, "Completa los datos de despacho y pago.", "error");
            return;
        }

        const problema = revisarStock(detalle);
        if (problema) {
            Formulario.mostrarEstado(mensajePago, `No hay stock suficiente de ${problema}. Ajusta la cantidad.`, "error");
            mostrarCarrito();
            return;
        }

        confirmarCompra();
    });

    // 6.4 Al abrir la página: dirección guardada en la ficha del cliente
    const fichaCliente = MV.clientes().find(function (c) { return c.correo === MV.correo(); });
    if (fichaCliente && fichaCliente.direccion) {
        document.getElementById("pagoDireccion").value = fichaCliente.direccion;
    }

    // Primera ejecución
    mostrarCarrito();
}
