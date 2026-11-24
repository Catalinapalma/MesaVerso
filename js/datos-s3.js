/* ==========================================================
   MESAVERSO — SEMANA 3
   js/datos-s3.js · Datos ficticios y almacenamiento del navegador

   - Define el catálogo, clientes, usuarios y pedidos de ejemplo
     como ARREGLOS DE OBJETOS.
   - Guarda los cambios en localStorage (permanecen al cerrar el navegador).
   - Guarda la sesión ficticia en sessionStorage (dura lo que dura la pestaña).
   - Expone todo en un único objeto global: MV (MesaVerso).

   IMPORTANTE: no hay API, servidor ni base de datos. Cualquier persona
   puede modificar estos datos desde F12 > Application, por eso NO es
   autenticación real y nunca se guardan contraseñas.

   Este archivo debe cargarse ANTES que los demás archivos *-s3.js.
   ========================================================== */

(function () {
    "use strict";

    // Todas las claves de Storage comienzan igual para reconocerlas en F12.
    const PREFIJO = "mv_s3_";


    /* ==================== 1. DATOS INICIALES ==================== */

    // Los 12 juegos de las semanas 1 y 2. Se conservan nombres, imágenes,
    // descripciones y precios. "precioOferta" es null cuando no hay descuento.
    const productosIniciales = [
        { id: 1,  nombre: "Catan",           categoria: "Estrategia",   precio: 34990, precioOferta: 27992, stock: 8,  imagen: "img/catan.png",       descripcion: "Comercia, construye y desarrolla asentamientos." },
        { id: 2,  nombre: "Ticket to Ride",  categoria: "Estrategia",   precio: 39990, precioOferta: 35991, stock: 5,  imagen: "img/ticket.png",      descripcion: "Conecta ciudades y completa rutas ferroviarias." },
        { id: 3,  nombre: "Ajedrez Clásico", categoria: "Estrategia",   precio: 15990, precioOferta: null,  stock: 12, imagen: "img/ajedrez.png",     descripcion: "Anticipa cada movimiento para lograr el jaque mate." },
        { id: 4,  nombre: "Dixit",           categoria: "Familiares",   precio: 29990, precioOferta: 25492, stock: 6,  imagen: "img/dixit.png",       descripcion: "Imaginación y pistas para toda la familia." },
        { id: 5,  nombre: "Carcassonne",     categoria: "Familiares",   precio: 24990, precioOferta: null,  stock: 7,  imagen: "img/carcassonne.png", descripcion: "Crea paisajes y suma puntos con tus fichas." },
        { id: 6,  nombre: "Aventureros",     categoria: "Familiares",   precio: 19990, precioOferta: 18990, stock: 3,  imagen: "img/aventureros.png", descripcion: "Explora caminos y cumple desafíos en grupo." },
        { id: 7,  nombre: "UNO",             categoria: "Cartas",       precio: 7990,  precioOferta: null,  stock: 20, imagen: "img/uno.png",         descripcion: "Descarta tus cartas antes que los demás." },
        { id: 8,  nombre: "Dobble",          categoria: "Cartas",       precio: 14990, precioOferta: 13491, stock: 10, imagen: "img/dobble.png",      descripcion: "Encuentra el símbolo repetido contra el reloj." },
        { id: 9,  nombre: "Virus!",          categoria: "Cartas",       precio: 11990, precioOferta: null,  stock: 9,  imagen: "img/virus.png",       descripcion: "Reúne órganos sanos y evita contagios." },
        { id: 10, nombre: "Pandemic",        categoria: "Cooperativos", precio: 34990, precioOferta: 29742, stock: 4,  imagen: "img/pandemic.png",    descripcion: "Colaboren para detener brotes por el mundo." },
        { id: 11, nombre: "Just One",        categoria: "Cooperativos", precio: 21990, precioOferta: null,  stock: 6,  imagen: "img/justone.png",     descripcion: "Den pistas únicas para adivinar palabras." },
        { id: 12, nombre: "La misión azul",  categoria: "Cooperativos", precio: 18990, precioOferta: 17091, stock: 2,  imagen: "img/azul.png",        descripcion: "Resuelvan juntos desafíos por turnos." }
    ];

    // Fichas de clientes (datos de contacto y despacho).
    const clientesIniciales = [
        { id: 1, nombre: "Cliente de prueba", correo: "cliente@mesaverso.cl", telefono: "+56912345678", direccion: "Av. Siempre Viva 123, Santiago" },
        { id: 2, nombre: "Andrea Rojas",      correo: "andrea@ejemplo.cl",    telefono: "+56987654321", direccion: "Los Aromos 45, Valparaíso" }
    ];

    // Fichas de usuarios del sistema (quién es quién y qué rol tiene).
    const usuariosIniciales = [
        { id: 1, nombre: "Administradora MesaVerso", usuario: "admin_mv",   correo: "admin@mesaverso.cl",   rol: "administrador" },
        { id: 2, nombre: "Cliente de prueba",        usuario: "cliente_mv", correo: "cliente@mesaverso.cl", rol: "cliente" },
        { id: 3, nombre: "Andrea Rojas",             usuario: "andrea_r",   correo: "andrea@ejemplo.cl",    rol: "cliente" }
    ];

    // Las DOS cuentas que permiten iniciar sesión (una por rol).
    // Son públicas y ficticias: las claves están escritas en el código
    // solo para la demostración. Nunca uses contraseñas reales aquí.
    const cuentasDemo = [
        { correo: "cliente@mesaverso.cl", clave: "Cliente123!", rol: "cliente",       nombre: "Cliente de prueba" },
        { correo: "admin@mesaverso.cl",   clave: "Admin123!",   rol: "administrador", nombre: "Administradora MesaVerso" }
    ];

    // Un pedido de cada cliente para poder demostrar filter() en el historial.
    const pedidosIniciales = [
        {
            id: 1, correo: "cliente@mesaverso.cl", cliente: "Cliente de prueba",
            items: [{ id: 3, nombre: "Ajedrez Clásico", cantidad: 1, precio: 15990 }],
            total: 15990, fecha: "2026-11-01", estado: "Entregado (ejemplo)",
            despacho: "Av. Siempre Viva 123, Santiago", pago: "Débito (simulado)"
        },
        {
            id: 2, correo: "andrea@ejemplo.cl", cliente: "Andrea Rojas",
            items: [{ id: 7, nombre: "UNO", cantidad: 2, precio: 7990 }],
            total: 15980, fecha: "2026-11-03", estado: "Entregado (ejemplo)",
            despacho: "Los Aromos 45, Valparaíso", pago: "Transferencia (simulada)"
        }
    ];


    /* ==================== 2. LEER Y GUARDAR (localStorage) ==================== */

    // Lee una clave de localStorage. Si nunca se guardó o el texto está dañado,
    // devuelve una COPIA de los datos iniciales para que la demo siga funcionando.
    function leer(nombre, alternativa) {
        try {
            const texto = localStorage.getItem(PREFIJO + nombre);
            if (texto === null) return structuredClone(alternativa);

            const dato = JSON.parse(texto); // texto JSON -> arreglo u objeto

            // Si se esperaba un arreglo y llegó otra cosa, se usa la copia inicial.
            if (Array.isArray(alternativa) && !Array.isArray(dato)) {
                return structuredClone(alternativa);
            }
            return dato;
        } catch (error) {
            return structuredClone(alternativa);
        }
    }

    // Convierte el valor a texto JSON y lo guarda en este navegador.
    function guardar(nombre, valor) {
        localStorage.setItem(PREFIJO + nombre, JSON.stringify(valor));
    }

    // Calcula el siguiente ID de una lista: el mayor ID existente + 1.
    function siguienteId(lista) {
        return Math.max(0, ...lista.map(function (item) { return Number(item.id) || 0; })) + 1;
    }


    /* ==================== 3. SESIÓN FICTICIA (sessionStorage) ==================== */

    // Solo se guardan rol, correo y nombre. Nunca la contraseña.
    function rol()    { return sessionStorage.getItem(PREFIJO + "rol"); }
    function correo() { return sessionStorage.getItem(PREFIJO + "correo"); }
    function nombre() { return sessionStorage.getItem(PREFIJO + "nombre"); }

    // Guarda los datos de la cuenta que inició sesión.
    function iniciar(usuario) {
        sessionStorage.setItem(PREFIJO + "rol", usuario.rol);
        sessionStorage.setItem(PREFIJO + "correo", usuario.correo);
        sessionStorage.setItem(PREFIJO + "nombre", usuario.nombre);
    }

    // Cambia el nombre que se muestra en el menú (se usa al editar el perfil).
    function cambiarNombre(nuevoNombre) {
        sessionStorage.setItem(PREFIJO + "nombre", nuevoNombre);
    }

    // Cierra la sesión: borra solo los datos de sesión, no el catálogo.
    function salir() {
        ["rol", "correo", "nombre"].forEach(function (clave) {
            sessionStorage.removeItem(PREFIJO + clave);
        });
    }

    // "Protección" visual de páginas: si el rol actual no está permitido,
    // envía al login. NO es seguridad real, el navegador es manipulable.
    function exigir(rolesPermitidos) {
        if (!rolesPermitidos.includes(rol())) {
            window.location.href = "login.html";
            return false;
        }
        return true;
    }

    // Borra todos los cambios para dejar la demo como recién descomprimida.
    function restablecer() {
        ["productos", "clientes", "usuarios", "pedidos", "carrito", "perfiles", "ultimoPedido"]
            .forEach(function (clave) { localStorage.removeItem(PREFIJO + clave); });
        salir();
    }


    /* ==================== 4. FUNCIONES DE APOYO ==================== */

    // Formatea un número como peso chileno: 27992 -> "$27.992"
    function moneda(numero) {
        return new Intl.NumberFormat("es-CL", {
            style: "currency", currency: "CLP", maximumFractionDigits: 0
        }).format(numero);
    }

    // Precio que realmente paga el cliente: la oferta si existe, si no el normal.
    function precioFinal(producto) {
        return producto.precioOferta ? producto.precioOferta : producto.precio;
    }

    // Porcentaje de descuento redondeado: (34990 -> 27992) = 20
    function descuento(producto) {
        if (!producto.precioOferta) return 0;
        return Math.round((1 - producto.precioOferta / producto.precio) * 100);
    }

    // Suma las unidades del carrito: [{id:1,cantidad:2},{id:4,cantidad:1}] -> 3
    function unidadesCarrito() {
        return leer("carrito", []).reduce(function (total, item) {
            return total + item.cantidad;
        }, 0);
    }


    /* ==================== 5. OBJETO GLOBAL MV ==================== */
    // Un único punto de acceso evita escribir las claves de Storage a mano
    // en cada archivo (y equivocarse en alguna).

    window.MV = {
        leer, guardar, siguienteId,
        rol, correo, nombre, iniciar, cambiarNombre, salir, exigir, restablecer,
        moneda, precioFinal, descuento, unidadesCarrito,
        categorias: ["Estrategia", "Familiares", "Cartas", "Cooperativos"],
        cuentasDemo: cuentasDemo,
        originales: function () { return structuredClone(productosIniciales); },
        productos:  function () { return leer("productos", productosIniciales); },
        clientes:   function () { return leer("clientes", clientesIniciales); },
        usuarios:   function () { return leer("usuarios", usuariosIniciales); },
        pedidos:    function () { return leer("pedidos", pedidosIniciales); },
        carrito:    function () { return leer("carrito", []); }
    };
})();
