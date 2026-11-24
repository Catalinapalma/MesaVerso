/* ==========================================================
   MESAVERSO — SEMANA 3
   js/confirmacion-s3.js · Detalle del pedido recién confirmado

   carrito-s3.js guarda el ID del último pedido en localStorage
   ("ultimoPedido"). Aquí se busca ese pedido con find() y se
   muestra su detalle. El pago es SIMULADO.
   ========================================================== */

if (MV.exigir(["cliente"])) {

    const detallePedido = document.getElementById("detallePedido");
    const idPedido = MV.leer("ultimoPedido", null);

    // Se busca el pedido y se comprueba que pertenezca a quien inició sesión
    const pedido = MV.pedidos().find(function (p) {
        return p.id === idPedido && p.correo === MV.correo();
    });

    // Crea una fila "etiqueta ........ valor" con las clases del resumen del carrito
    function crearFila(etiqueta, valor, clase) {
        const fila = document.createElement("div");
        fila.className = "summary-row" + (clase ? " " + clase : "");
        const izquierda = document.createElement("span");
        izquierda.textContent = etiqueta;
        const derecha = document.createElement("span");
        derecha.textContent = valor;
        fila.append(izquierda, derecha);
        return fila;
    }

    if (!pedido) {
        // Por ejemplo, si se entra directo a la página sin comprar
        const aviso = document.createElement("p");
        aviso.className = "empty-state";
        aviso.textContent = "No encontramos un pedido reciente. Revisa tu historial de compras.";
        detallePedido.append(aviso);
    } else {
        detallePedido.append(
            crearFila("N° de pedido", "#" + String(pedido.id).padStart(5, "0")),
            crearFila("Fecha", pedido.fecha),
            crearFila("Despacho a", pedido.despacho),
            crearFila("Medio de pago", pedido.pago)
        );

        // Una fila por cada producto comprado
        pedido.items.forEach(function (item) {
            detallePedido.append(
                crearFila(`${item.cantidad} × ${item.nombre}`, MV.moneda(item.precio * item.cantidad))
            );
        });

        detallePedido.append(
            crearFila("Total pagado (simulado)", MV.moneda(pedido.total), "total")
        );
    }
}
