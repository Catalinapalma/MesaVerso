/* ==========================================================
   MESAVERSO — SEMANA 3
   js/historial-s3.js · Mis compras (historial.html)

   Todos los pedidos están en un solo arreglo (MV.pedidos()).
   Con filter() se muestran SOLO los del correo que inició sesión:
   así cada compra queda asociada a su usuario.
   ========================================================== */

if (MV.exigir(["cliente"])) {

    const tablaHistorial = document.getElementById("tablaHistorial");
    const mensajeHistorial = document.getElementById("mensajeHistorial");

    // 1. Pedidos del cliente actual, del más reciente al más antiguo
    const pedidosPropios = MV.pedidos()
        .filter(function (pedido) { return pedido.correo === MV.correo(); })
        .sort(function (a, b) { return b.id - a.id; });

    // 2. Resumen con reduce(): cantidad de juegos y total gastado
    const totalJuegos = pedidosPropios.reduce(function (total, pedido) {
        return total + pedido.items.reduce(function (suma, item) { return suma + item.cantidad; }, 0);
    }, 0);

    const totalGastado = pedidosPropios.reduce(function (total, pedido) {
        return total + pedido.total;
    }, 0);

    document.getElementById("totalPedidos").textContent = pedidosPropios.length;
    document.getElementById("totalJuegos").textContent = totalJuegos;
    document.getElementById("totalGastado").textContent = MV.moneda(totalGastado);

    // 3. Crear una celda <td> con texto seguro (textContent no interpreta HTML)
    function crearCelda(texto) {
        const celda = document.createElement("td");
        celda.textContent = texto;
        return celda;
    }

    // 4. Una fila por pedido
    if (pedidosPropios.length === 0) {
        mensajeHistorial.textContent = "Todavía no tienes compras. ¡Tu primera partida te espera!";
    } else {
        mensajeHistorial.textContent = `Tienes ${pedidosPropios.length} pedido(s) registrados.`;

        pedidosPropios.forEach(function (pedido) {
            const productos = pedido.items
                .map(function (item) { return `${item.cantidad} × ${item.nombre}`; })
                .join(", ");

            const fila = document.createElement("tr");
            fila.append(
                crearCelda("#" + String(pedido.id).padStart(5, "0")),
                crearCelda(pedido.fecha),
                crearCelda(productos),
                crearCelda(pedido.pago),
                crearCelda(pedido.estado),
                crearCelda(MV.moneda(pedido.total))
            );
            tablaHistorial.append(fila);
        });
    }
}
