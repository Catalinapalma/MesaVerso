/* ==========================================================
   MESAVERSO — SEMANA 3
   js/login-s3.js · Inicio de sesión de demostración (login.html)

   Se practica: arreglos de objetos, find(), evento submit,
   comparación estricta (===), DOM y sessionStorage.

   Flujo:
   1. Se valida que el correo tenga formato y que la clave no esté vacía.
   2. Se busca la cuenta en MV.cuentasDemo (datos-s3.js).
   3. Si existe, se guarda la sesión (rol, correo y nombre; nunca la clave)
      y se envía a cada rol a su página: cliente -> tienda, admin -> panel.

   No hay servidor: esto NO es autenticación real.
   ========================================================== */


/* ==================== 1. ELEMENTOS DEL DOM ==================== */

const formLogin = document.getElementById("formLogin");
const campoCorreo = document.getElementById("correoLogin");
const campoClave = document.getElementById("claveLogin");
const mensajeLogin = document.getElementById("mensajeLogin");


/* ==================== 2. REGLAS DEL FORMULARIO ==================== */
// Clave: id del input. Valor: función que devuelve el error o "".

const reglasLogin = {
    correoLogin: Validaciones.validarCorreo,
    claveLogin: function (valor) {
        if (valor === "") return "Ingresa tu contraseña.";
        if (valor.length > Validaciones.CLAVE_MAX) return "La contraseña es demasiado larga.";
        return "";
    }
};


/* ==================== 3. FUNCIONES ==================== */

// Busca una cuenta cuyo correo Y clave coincidan. find() devuelve el
// objeto encontrado, o undefined si ninguno cumple la condición.
function buscarCuenta(correo, clave) {
    return MV.cuentasDemo.find(function (cuenta) {
        return cuenta.correo === correo && cuenta.clave === clave;
    });
}

// Si el administrador o el propio perfil cambiaron el nombre de la persona,
// se usa el nombre actualizado de la ficha de usuarios.
function nombreActualizado(cuenta) {
    const ficha = MV.usuarios().find(function (usuario) {
        return usuario.correo === cuenta.correo;
    });
    return ficha ? ficha.nombre : cuenta.nombre;
}

// Página a la que se vuelve después de entrar.
// Ej: login.html?volver=estrategia.html -> vuelve a estrategia.html
// Solo se aceptan nombres simples de archivo .html (evita redirigir a otros sitios).
function paginaDestino(rol) {
    const volver = new URLSearchParams(window.location.search).get("volver");
    if (volver && /^[a-z]+\.html$/.test(volver)) return volver;
    return rol === "administrador" ? "admin.html" : "index.html";
}


/* ==================== 4. EVENTOS ==================== */

// 4.1 Validación en vivo de ambos campos (formulario-s3.js)
Formulario.validarEnVivo(reglasLogin);

// 4.2 Botón "Ver" de la contraseña
Formulario.activarVerClave(document.getElementById("btnVerClaveLogin"), campoClave);

// 4.3 Enviar el formulario
formLogin.addEventListener("submit", function (evento) {
    evento.preventDefault(); // Evita que la página se recargue

    // Paso 1: revisar formato de los campos
    if (!Formulario.validarTodo(reglasLogin)) {
        Formulario.mostrarEstado(mensajeLogin, "Revisa los campos marcados en rojo.", "error");
        return;
    }

    // Paso 2: buscar la cuenta (el correo se compara en minúsculas)
    const correo = campoCorreo.value.trim().toLowerCase();
    const cuenta = buscarCuenta(correo, campoClave.value);

    if (!cuenta) {
        Formulario.pintarCampo(campoClave, "Correo o contraseña incorrectos.");
        Formulario.mostrarEstado(
            mensajeLogin,
            "Los datos no coinciden con ninguna cuenta. Usa una de las cuentas de prueba.",
            "error"
        );
        campoClave.value = "";
        campoClave.focus();
        return;
    }

    // Paso 3: guardar la sesión (sin la clave) y redirigir según el rol
    const usuario = { rol: cuenta.rol, correo: cuenta.correo, nombre: nombreActualizado(cuenta) };
    MV.iniciar(usuario);

    Formulario.mostrarEstado(
        mensajeLogin,
        `¡Hola, ${usuario.nombre}! Ingresaste como ${usuario.rol}. Redirigiendo...`,
        "exito"
    );

    // Pequeña pausa para que se alcance a leer el mensaje
    setTimeout(function () {
        window.location.href = paginaDestino(usuario.rol);
    }, 900);
});

// 4.4 Botón "Limpiar": borra colores y mensajes
formLogin.addEventListener("reset", function () {
    Formulario.limpiarTodo(reglasLogin);
    Formulario.limpiarEstado(mensajeLogin);
});

// 4.5 Botones "Usar cuenta ...": completan los campos, pero NO inician sesión
document.querySelectorAll("[data-demo]").forEach(function (boton) {
    boton.addEventListener("click", function () {
        const cuenta = MV.cuentasDemo.find(function (c) {
            return c.rol === boton.dataset.demo;
        });

        campoCorreo.value = cuenta.correo;
        campoClave.value = cuenta.clave;
        Formulario.limpiarTodo(reglasLogin);
        Formulario.mostrarEstado(mensajeLogin, "Cuenta de prueba cargada. Presiona «Iniciar sesión».", "exito");
        campoCorreo.focus();
    });
});

// 4.6 Si ya hay una sesión abierta, se avisa al entrar a la página
if (MV.rol()) {
    Formulario.mostrarEstado(
        mensajeLogin,
        `Ya iniciaste sesión como ${MV.nombre()} (${MV.rol()}). Puedes entrar con otra cuenta.`,
        "exito"
    );
}
