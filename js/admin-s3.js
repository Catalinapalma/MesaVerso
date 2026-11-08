/* ==========================================================
   MESAVERSO — SEMANA 3
   js/admin-s3.js · Panel de administración (admin.html)

   Solo para el rol "administrador". Contiene los mantenedores:
   1. Productos e inventario: agregar, editar, eliminar y ajustar stock.
   2. Clientes: agregar, editar y eliminar fichas de clientes.
   3. Usuarios: agregar, editar, eliminar y asignar roles.
   4. Pedidos: ver las compras de todos los clientes (solo consulta).

   Todos siguen el mismo patrón: LEER -> DIBUJAR -> VALIDAR -> GUARDAR.
   Los datos se guardan en localStorage (sin servidor ni base de datos).
   ========================================================== */

if (MV.exigir(["administrador"])) {

    /* ==================== 1. FUNCIONES DE APOYO ==================== */

    const mensajeAdmin = document.getElementById("mensajeAdmin");

    // Mensaje general del panel (verde = exito, rojo = error)
    function avisar(texto, tipo) {
        Formulario.mostrarEstado(mensajeAdmin, texto, tipo || "exito");
    }

    // Crea un botón pequeño con su evento (evita repetir este bloque)
    function crearBoton(texto, etiqueta, accion, peligro) {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "btn-mini" + (peligro ? " peligro" : "");
        boton.textContent = texto;
        boton.setAttribute("aria-label", etiqueta);
        boton.addEventListener("click", accion);
        return boton;
    }

    // Crea una celda <td>. Si recibe texto usa textContent (seguro);
    // si recibe uno o más elementos HTML los agrega dentro.
    function crearCelda(contenido) {
        const celda = document.createElement("td");
        if (contenido instanceof Node) {
            celda.append(contenido);
        } else if (Array.isArray(contenido)) {
            celda.append(...contenido);
        } else {
            celda.textContent = contenido;
        }
        return celda;
    }

    // Normaliza texto para buscar sin mayúsculas ni tildes
    function normalizar(texto) {
        return texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    }


    /* ==================== 2. RESUMEN (tarjetas superiores) ==================== */

    function mostrarResumen() {
        const productos = MV.productos();
        const pedidos = MV.pedidos();

        const unidades = productos.reduce(function (total, p) { return total + p.stock; }, 0);
        const stockBajo = productos.filter(function (p) { return p.stock <= 3; }).length;
        const ventas = pedidos.reduce(function (total, p) { return total + p.total; }, 0);

        document.getElementById("statProductos").textContent = productos.length;
        document.getElementById("statUnidades").textContent = unidades;
        document.getElementById("statBajo").textContent = stockBajo;
        document.getElementById("statPedidos").textContent = pedidos.length;
        document.getElementById("statVentas").textContent = MV.moneda(ventas);
    }


    /* ==================== 3. PRODUCTOS E INVENTARIO ==================== */

    const formProducto = document.getElementById("formProducto");
    const campoProdId = document.getElementById("prodId");
    const tituloFormProducto = document.getElementById("tituloFormProducto");
    const tablaProductos = document.getElementById("tablaProductos");
    const buscarProducto = document.getElementById("buscarProducto");
    const imagenesValidas = Array.from(document.querySelectorAll("#prodImagen option"))
        .map(function (opcion) { return opcion.value; })
        .filter(Boolean);

    // 3.1 Reglas de cada campo del producto
    const reglasProducto = {
        prodNombre: function (valor) {
            const error = Validaciones.validarTexto(valor, 3, 40, "el nombre del juego");
            if (error) return error;

            // No puede haber dos productos con el mismo nombre
            const idEditando = Number(campoProdId.value);
            const repetido = MV.productos().some(function (p) {
                return normalizar(p.nombre) === normalizar(valor.trim()) && p.id !== idEditando;
            });
            return repetido ? "Ya existe un producto con ese nombre." : "";
        },
        prodCategoria: function (valor) {
            return Validaciones.validarOpcion(valor, MV.categorias, "una categoría");
        },
        prodImagen: function (valor) {
            return Validaciones.validarOpcion(valor, imagenesValidas, "una imagen");
        },
        prodPrecio: function (valor) {
            return Validaciones.validarEntero(valor, 1000, 999999, "el precio");
        },
        prodOferta: function (valor) {
            if (valor.trim() === "") return ""; // opcional
            const error = Validaciones.validarEntero(valor, 1, 999999, "el precio de oferta");
            if (error) return error;
            const precio = Number(document.getElementById("prodPrecio").value);
            if (precio && Number(valor) >= precio) return "La oferta debe ser menor que el precio normal.";
            return "";
        },
        prodStock: function (valor) {
            return Validaciones.validarEntero(valor, 0, 999, "el stock");
        },
        prodDescripcion: function (valor) {
            return Validaciones.validarTexto(valor, 10, 120, "una descripción");
        }
    };

    // 3.2 Dibujar la tabla (filtrada por el buscador)
    function mostrarProductos() {
        const busqueda = normalizar(buscarProducto.value.trim());
        tablaProductos.replaceChildren();

        MV.productos()
            .filter(function (p) {
                return normalizar(p.nombre + " " + p.categoria).includes(busqueda);
            })
            .forEach(function (producto) {
                const fila = document.createElement("tr");

                // Celda de stock con botones − y + (ajuste rápido de inventario)
                const stock = document.createElement("strong");
                stock.textContent = producto.stock;
                if (producto.stock <= 3) stock.className = "text-warning";

                fila.append(
                    crearCelda(String(producto.id)),
                    crearCelda(producto.nombre),
                    crearCelda(producto.categoria),
                    crearCelda(MV.moneda(producto.precio)),
                    crearCelda(producto.precioOferta ? `${MV.moneda(producto.precioOferta)} (-${MV.descuento(producto)}%)` : "—"),
                    crearCelda([
                        crearBoton("−", "Restar una unidad de " + producto.nombre, function () { ajustarStock(producto.id, -1); }),
                        stock,
                        crearBoton("+", "Sumar una unidad de " + producto.nombre, function () { ajustarStock(producto.id, 1); })
                    ]),
                    crearCelda([
                        crearBoton("Editar", "Editar " + producto.nombre, function () { editarProducto(producto.id); }),
                        crearBoton("Eliminar", "Eliminar " + producto.nombre, function () { eliminarProducto(producto.id); }, true)
                    ])
                );
                tablaProductos.append(fila);
            });

        if (!tablaProductos.children.length) {
            const fila = document.createElement("tr");
            const celda = crearCelda("No hay productos que coincidan con la búsqueda.");
            celda.colSpan = 7;
            fila.append(celda);
            tablaProductos.append(fila);
        }

        mostrarResumen();
    }

    // 3.3 Sumar o restar una unidad de stock (nunca bajo 0)
    function ajustarStock(id, cambio) {
        const productos = MV.productos();
        const producto = productos.find(function (p) { return p.id === id; });
        if (!producto) return;

        if (producto.stock + cambio < 0) {
            avisar(`${producto.nombre} ya tiene stock 0.`, "error");
            return;
        }

        producto.stock += cambio;
        MV.guardar("productos", productos);
        mostrarProductos();
        avisar(`Inventario actualizado: ${producto.nombre} ahora tiene ${producto.stock} unidad(es).`);
    }

    // 3.4 Cargar un producto en el formulario para editarlo
    function editarProducto(id) {
        const producto = MV.productos().find(function (p) { return p.id === id; });
        if (!producto) return;

        Formulario.limpiarTodo(reglasProducto);
        campoProdId.value = producto.id;
        document.getElementById("prodNombre").value = producto.nombre;
        document.getElementById("prodCategoria").value = producto.categoria;
        document.getElementById("prodImagen").value = producto.imagen;
        document.getElementById("prodPrecio").value = producto.precio;
        document.getElementById("prodOferta").value = producto.precioOferta || "";
        document.getElementById("prodStock").value = producto.stock;
        document.getElementById("prodDescripcion").value = producto.descripcion;

        tituloFormProducto.textContent = "EDITANDO: " + producto.nombre.toUpperCase();
        formProducto.scrollIntoView({ behavior: "smooth", block: "start" });
        document.getElementById("prodNombre").focus({ preventScroll: true });
        avisar(`Editando ${producto.nombre}. Cambia los datos y presiona «Guardar producto».`);
    }

    // 3.5 Eliminar un producto (también se quita de los carritos guardados)
    function eliminarProducto(id) {
        const producto = MV.productos().find(function (p) { return p.id === id; });
        if (!producto) return;
        if (!window.confirm(`¿Eliminar "${producto.nombre}" del catálogo?`)) return;

        MV.guardar("productos", MV.productos().filter(function (p) { return p.id !== id; }));
        MV.guardar("carrito", MV.carrito().filter(function (i) { return i.id !== id; }));

        if (Number(campoProdId.value) === id) formProducto.reset();
        mostrarProductos();
        avisar(`"${producto.nombre}" fue eliminado. Ya no aparece en su categoría.`);
    }

    // 3.6 Guardar (crear o modificar) al enviar el formulario
    formProducto.addEventListener("submit", function (evento) {
        evento.preventDefault();

        if (!Formulario.validarTodo(reglasProducto)) {
            avisar("Revisa los campos del producto marcados en rojo.", "error");
            return;
        }

        const productos = MV.productos();
        const idEditando = Number(campoProdId.value);
        const posicion = productos.findIndex(function (p) { return p.id === idEditando; });
        const oferta = document.getElementById("prodOferta").value.trim();

        const producto = {
            id: posicion >= 0 ? idEditando : MV.siguienteId(productos),
            nombre: document.getElementById("prodNombre").value.trim(),
            categoria: document.getElementById("prodCategoria").value,
            precio: Number(document.getElementById("prodPrecio").value),
            precioOferta: oferta === "" ? null : Number(oferta),
            stock: Number(document.getElementById("prodStock").value),
            imagen: document.getElementById("prodImagen").value,
            descripcion: document.getElementById("prodDescripcion").value.trim()
        };

        // Si existe se reemplaza en su posición; si no, se agrega al final
        if (posicion >= 0) {
            productos[posicion] = producto;
        } else {
            productos.push(producto);
        }
        MV.guardar("productos", productos);

        formProducto.reset();
        mostrarProductos();
        avisar(
            posicion >= 0
                ? `"${producto.nombre}" actualizado. Revisa la página ${producto.categoria}.`
                : `"${producto.nombre}" agregado con ID ${producto.id}. Ya aparece en ${producto.categoria}.`
        );
    });

    // 3.7 Limpiar: vuelve al modo "agregar"
    formProducto.addEventListener("reset", function () {
        campoProdId.value = "";
        tituloFormProducto.textContent = "AGREGAR PRODUCTO";
        Formulario.limpiarTodo(reglasProducto);
    });

    Formulario.validarEnVivo(reglasProducto);
    buscarProducto.addEventListener("input", mostrarProductos);


    /* ==================== 4. MANTENEDOR GENÉRICO (clientes y usuarios) ==================== */
    // Ambos mantenedores hacen lo mismo con distintos campos, así que se
    // escribe UNA función que recibe la configuración de cada uno.

    function crearMantenedor(config) {
        const form = document.getElementById(config.form);
        const campoId = document.getElementById(config.campoId);
        const titulo = document.getElementById(config.titulo);
        const tabla = document.getElementById(config.tabla);

        // ID del registro que se está editando (0 = nuevo)
        function idEditando() {
            return Number(campoId.value);
        }

        // Dibuja una fila por registro
        function mostrar() {
            tabla.replaceChildren();

            config.obtener().forEach(function (registro) {
                const fila = document.createElement("tr");

                config.columnas(registro).forEach(function (valor) {
                    fila.append(crearCelda(valor));
                });

                fila.append(crearCelda([
                    crearBoton("Editar", "Editar " + registro.nombre, function () { editar(registro.id); }),
                    crearBoton("Eliminar", "Eliminar " + registro.nombre, function () { eliminar(registro.id); }, true)
                ]));
                tabla.append(fila);
            });
        }

        // Copia los datos del registro a los campos del formulario
        function editar(id) {
            const registro = config.obtener().find(function (r) { return r.id === id; });
            if (!registro) return;

            Formulario.limpiarTodo(config.reglas);
            campoId.value = registro.id;
            Object.keys(config.campos).forEach(function (idInput) {
                document.getElementById(idInput).value = registro[config.campos[idInput]] || "";
            });

            titulo.textContent = "EDITANDO: " + registro.nombre.toUpperCase();
            form.scrollIntoView({ behavior: "smooth", block: "start" });
            avisar(`Editando la ficha de ${registro.nombre}.`);
        }

        // Elimina un registro (si la configuración lo permite)
        function eliminar(id) {
            const registro = config.obtener().find(function (r) { return r.id === id; });
            if (!registro) return;

            const motivo = config.impedirEliminar ? config.impedirEliminar(registro) : "";
            if (motivo) {
                avisar(motivo, "error");
                return;
            }
            if (!window.confirm(`¿Eliminar a ${registro.nombre}?`)) return;

            MV.guardar(config.nombreLista, config.obtener().filter(function (r) { return r.id !== id; }));
            if (idEditando() === id) form.reset();
            mostrar();
            avisar(`${registro.nombre} fue eliminado de ${config.nombreLista}.`);
        }

        // Guardar: valida, arma el objeto con los campos y lo guarda
        form.addEventListener("submit", function (evento) {
            evento.preventDefault();

            if (!Formulario.validarTodo(config.reglas)) {
                avisar(`Revisa los campos de ${config.nombreLista} marcados en rojo.`, "error");
                return;
            }

            const lista = config.obtener();
            const posicion = lista.findIndex(function (r) { return r.id === idEditando(); });
            const registro = posicion >= 0 ? Object.assign({}, lista[posicion]) : { id: MV.siguienteId(lista) };

            // Cada input se copia a su propiedad: cliNombre -> nombre, etc.
            Object.keys(config.campos).forEach(function (idInput) {
                registro[config.campos[idInput]] = document.getElementById(idInput).value.trim();
            });
            registro.correo = registro.correo.toLowerCase();

            if (posicion >= 0) {
                lista[posicion] = registro;
            } else {
                lista.push(registro);
            }
            MV.guardar(config.nombreLista, lista);

            form.reset();
            mostrar();
            avisar(`Ficha de ${registro.nombre} guardada en ${config.nombreLista}.`);
        });

        // Limpiar: vuelve al modo "agregar"
        form.addEventListener("reset", function () {
            campoId.value = "";
            titulo.textContent = config.textoNuevo;
            Formulario.limpiarTodo(config.reglas);
        });

        Formulario.validarEnVivo(config.reglas);
        mostrar();

        // Se devuelve "idEditando" para usarlo en las reglas de correo repetido
        return { mostrar: mostrar, idEditando: idEditando };
    }

    // Revisa que un valor no esté repetido en otra ficha de la lista
    function estaRepetido(lista, propiedad, valor, idActual) {
        return lista.some(function (r) {
            return String(r[propiedad]).toLowerCase() === valor.trim().toLowerCase() && r.id !== idActual;
        });
    }


    /* ==================== 5. CLIENTES ==================== */

    const campoCliId = document.getElementById("cliId");

    crearMantenedor({
        nombreLista: "clientes",
        obtener: MV.clientes,
        form: "formCliente",
        campoId: "cliId",
        titulo: "tituloFormCliente",
        tabla: "tablaClientes",
        textoNuevo: "AGREGAR CLIENTE",
        campos: { cliNombre: "nombre", cliCorreo: "correo", cliTelefono: "telefono", cliDireccion: "direccion" },
        reglas: {
            cliNombre: Validaciones.validarNombre,
            cliCorreo: function (valor) {
                const error = Validaciones.validarCorreo(valor);
                if (error) return error;
                return estaRepetido(MV.clientes(), "correo", valor, Number(campoCliId.value))
                    ? "Ya existe un cliente con ese correo." : "";
            },
            cliTelefono: Validaciones.validarTelefono,
            cliDireccion: function (valor) { return Validaciones.validarDireccion(valor, false); }
        },
        // Columnas de la tabla. "Compras" cuenta los pedidos de ese correo.
        columnas: function (c) {
            const compras = MV.pedidos().filter(function (p) { return p.correo === c.correo; }).length;
            return [String(c.id), c.nombre, c.correo, c.telefono || "—", c.direccion || "—", String(compras)];
        }
    });


    /* ==================== 6. USUARIOS ==================== */

    const campoUsuId = document.getElementById("usuId");

    // ¿La ficha que se está editando es la del administrador que inició sesión?
    function esMiFicha(idFicha) {
        const ficha = MV.usuarios().find(function (u) { return u.id === idFicha; });
        return Boolean(ficha) && ficha.correo === MV.correo();
    }

    crearMantenedor({
        nombreLista: "usuarios",
        obtener: MV.usuarios,
        form: "formUsuario",
        campoId: "usuId",
        titulo: "tituloFormUsuario",
        tabla: "tablaUsuarios",
        textoNuevo: "AGREGAR USUARIO",
        campos: { usuNombre: "nombre", usuUsuario: "usuario", usuCorreo: "correo", usuRol: "rol" },
        reglas: {
            usuNombre: Validaciones.validarNombre,
            usuUsuario: function (valor) {
                const error = Validaciones.validarUsuario(valor);
                if (error) return error;
                return estaRepetido(MV.usuarios(), "usuario", valor, Number(campoUsuId.value))
                    ? "Ese nombre de usuario ya existe." : "";
            },
            usuCorreo: function (valor) {
                const error = Validaciones.validarCorreo(valor);
                if (error) return error;
                const id = Number(campoUsuId.value);
                if (esMiFicha(id) && valor.trim().toLowerCase() !== MV.correo()) {
                    return "No puedes cambiar el correo de la cuenta con la que iniciaste sesión.";
                }
                return estaRepetido(MV.usuarios(), "correo", valor, id) ? "Ya existe un usuario con ese correo." : "";
            },
            usuRol: function (valor) {
                const error = Validaciones.validarOpcion(valor, ["cliente", "administrador"], "un rol");
                if (error) return error;
                if (esMiFicha(Number(campoUsuId.value)) && valor !== "administrador") {
                    return "No puedes quitarte el rol de administrador a ti mismo.";
                }
                return "";
            }
        },
        columnas: function (u) {
            const etiqueta = document.createElement("span");
            etiqueta.className = "tag-rol " + u.rol;
            etiqueta.textContent = u.rol;
            return [String(u.id), u.nombre, u.usuario || "—", u.correo, etiqueta];
        },
        impedirEliminar: function (u) {
            return u.correo === MV.correo() ? "No puedes eliminar la cuenta con la que iniciaste sesión." : "";
        }
    });


    /* ==================== 7. PEDIDOS ==================== */

    const tablaPedidos = document.getElementById("tablaPedidos");

    // Dibuja una fila por pedido, del más reciente al más antiguo (solo lectura)
    function mostrarPedidos() {
        tablaPedidos.replaceChildren();

        MV.pedidos()
            .slice()
            .sort(function (a, b) { return b.id - a.id; })
            .forEach(function (pedido) {
                const productos = pedido.items
                    .map(function (i) { return `${i.cantidad} × ${i.nombre}`; })
                    .join(", ");

                const fila = document.createElement("tr");
                fila.append(
                    crearCelda("#" + String(pedido.id).padStart(5, "0")),
                    crearCelda(pedido.fecha),
                    crearCelda(`${pedido.cliente} (${pedido.correo})`),
                    crearCelda(productos),
                    crearCelda(MV.moneda(pedido.total)),
                    crearCelda(pedido.estado)
                );
                tablaPedidos.append(fila);
            });
    }


    /* ==================== 8. RESTABLECER Y PRIMERA CARGA ==================== */

    document.getElementById("btnRestablecer").addEventListener("click", function () {
        if (window.confirm("¿Restablecer todos los datos de demostración? Se cerrará la sesión.")) {
            MV.restablecer();
            window.location.href = "index.html";
        }
    });

    mostrarProductos();
    mostrarPedidos();

    // Si se llegó desde el catálogo con admin.html?editar=ID, se abre ese producto
    const idParaEditar = Number(new URLSearchParams(window.location.search).get("editar"));
    if (idParaEditar) {
        editarProducto(idParaEditar);
    }
}
