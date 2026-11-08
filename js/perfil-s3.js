/* ==========================================================
   MESAVERSO — SEMANA 3
   js/perfil-s3.js · Modificación del perfil (perfil.html)

   - Solo se puede usar con una sesión iniciada (cliente o administrador).
   - Lee la ficha de la persona desde MV.usuarios() y MV.clientes(),
     muestra sus datos en el formulario, los valida y los guarda.
   - Los cambios quedan en localStorage (sin servidor).
   ========================================================== */

// Si no hay sesión, MV.exigir() envía a login.html y no se ejecuta nada más.
if (MV.exigir(["cliente", "administrador"])) {

    /* ==================== 1. ELEMENTOS Y DATOS ==================== */

    const correoActual = MV.correo();
    const rolActual = MV.rol();

    const formPerfil = document.getElementById("formPerfil");
    const mensajePerfil = document.getElementById("mensajePerfil");

    document.getElementById("correoPerfil").textContent = correoActual;
    document.getElementById("perfilRol").textContent = rolActual;


    /* ==================== 2. LEER EL PERFIL ACTUAL ==================== */

    // Reúne en un solo objeto los datos de la ficha de usuario y de cliente.
    function leerPerfil() {
        const usuario = MV.usuarios().find(function (u) { return u.correo === correoActual; }) || {};
        const cliente = MV.clientes().find(function (c) { return c.correo === correoActual; }) || {};

        return {
            nombre: usuario.nombre || MV.nombre(),
            usuario: usuario.usuario || correoActual.split("@")[0],
            telefono: usuario.telefono || cliente.telefono || "",
            direccion: usuario.direccion || cliente.direccion || "",
            actualizado: usuario.actualizado || ""
        };
    }

    // Copia los datos del perfil a los campos del formulario.
    function mostrarPerfil() {
        const perfil = leerPerfil();

        document.getElementById("perfilNombre").value = perfil.nombre;
        document.getElementById("perfilUsuario").value = perfil.usuario;
        document.getElementById("perfilTelefono").value = perfil.telefono;
        document.getElementById("perfilDireccion").value = perfil.direccion;
        document.getElementById("perfilActualizado").textContent =
            perfil.actualizado || "Sin cambios todavía";

        Formulario.limpiarTodo(reglasPerfil);
    }


    /* ==================== 3. REGLAS DEL FORMULARIO DE DATOS ==================== */

    const reglasPerfil = {
        perfilNombre: Validaciones.validarNombre,
        perfilUsuario: function (valor) {
            const error = Validaciones.validarUsuario(valor);
            if (error) return error;

            // El nombre de usuario no puede pertenecer a otra persona
            const ocupado = MV.usuarios().some(function (u) {
                return u.usuario === valor.trim() && u.correo !== correoActual;
            });
            return ocupado ? "Ese nombre de usuario ya está en uso." : "";
        },
        perfilTelefono: Validaciones.validarTelefono,
        perfilDireccion: function (valor) {
            return Validaciones.validarDireccion(valor, false); // opcional
        }
    };


    /* ==================== 4. GUARDAR EL PERFIL ==================== */

    // Actualiza (o crea) la ficha en una lista y la guarda en localStorage.
    // findIndex() devuelve la posición del elemento, o -1 si no existe.
    function actualizarFicha(nombreLista, lista, datosNuevos) {
        const posicion = lista.findIndex(function (item) { return item.correo === correoActual; });

        if (posicion >= 0) {
            lista[posicion] = Object.assign({}, lista[posicion], datosNuevos);
        } else {
            lista.push(Object.assign({ id: MV.siguienteId(lista), correo: correoActual }, datosNuevos));
        }
        MV.guardar(nombreLista, lista);
    }

    function guardarPerfil() {
        const datos = {
            nombre: document.getElementById("perfilNombre").value.trim(),
            usuario: document.getElementById("perfilUsuario").value.trim(),
            telefono: document.getElementById("perfilTelefono").value.replace(/\s/g, ""),
            direccion: document.getElementById("perfilDireccion").value.trim(),
            actualizado: new Date().toLocaleString("es-CL")
        };

        // Ficha de usuario (la ve el administrador en la pestaña "Usuarios")
        actualizarFicha("usuarios", MV.usuarios(), Object.assign({ rol: rolActual }, datos));

        // Si es cliente, también se actualiza su ficha de cliente
        if (rolActual === "cliente") {
            actualizarFicha("clientes", MV.clientes(), {
                nombre: datos.nombre, telefono: datos.telefono, direccion: datos.direccion
            });
        }

        // El nombre del menú cambia de inmediato
        MV.cambiarNombre(datos.nombre);
        actualizarMenuPorRol();
        document.getElementById("perfilActualizado").textContent = datos.actualizado;
    }


    /* ==================== 5. EVENTOS ==================== */

    Formulario.validarEnVivo(reglasPerfil);

    // 5.1 Guardar datos personales
    formPerfil.addEventListener("submit", function (evento) {
        evento.preventDefault();

        if (!Formulario.validarTodo(reglasPerfil)) {
            Formulario.mostrarEstado(mensajePerfil, "Revisa los campos marcados en rojo.", "error");
            return;
        }

        guardarPerfil();
        Formulario.mostrarEstado(mensajePerfil, "Perfil actualizado correctamente.", "exito");
    });

    // 5.2 Deshacer: vuelve a cargar los datos guardados
    document.getElementById("btnDeshacerPerfil").addEventListener("click", function () {
        mostrarPerfil();
        Formulario.mostrarEstado(mensajePerfil, "Se restauraron los últimos datos guardados.", "exito");
    });

    // Primera ejecución: mostrar los datos guardados
    mostrarPerfil();
}
