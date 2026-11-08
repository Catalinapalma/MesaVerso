/* ==========================================================
   MESAVERSO — SEMANA 3
   js/recuperar-s3.js · Recuperación de contraseña simulada

   Se practica: evento submit, value, validación del correo,
   some() sobre un arreglo y textContent.

   1. Se valida que el correo tenga formato.
   2. Se comprueba que exista en las fichas de usuarios.
   3. Se muestra un mensaje de éxito.

   NO se envían correos ni se cambia ninguna contraseña real.
   ========================================================== */


/* ==================== 1. ELEMENTOS DEL DOM ==================== */

const formRecuperar = document.getElementById("formCorreoRecuperar");
const inputCorreo = document.getElementById("correoRecuperar");
const mensajeRecuperar = document.getElementById("mensajeCorreo");


/* ==================== 2. REGLAS ==================== */

const reglasRecuperar = {
    correoRecuperar: function (valor) {
        // Primero el formato (regla compartida de validaciones-s3.js)
        const error = Validaciones.validarCorreo(valor);
        if (error) return error;

        // Luego, que el correo pertenezca a alguna ficha de usuario.
        // some() devuelve true si AL MENOS un elemento cumple la condición.
        const correo = valor.trim().toLowerCase();
        const existe = MV.usuarios().some(function (usuario) {
            return usuario.correo === correo;
        });
        if (!existe) return "No encontramos una cuenta con ese correo. Prueba con cliente@mesaverso.cl";
        return "";
    }
};


/* ==================== 3. EVENTOS ==================== */

// 3.1 Validación en vivo del campo (formulario-s3.js)
Formulario.validarEnVivo(reglasRecuperar);

// 3.2 Enviar el formulario
formRecuperar.addEventListener("submit", function (evento) {
    evento.preventDefault(); // Evita que la página se recargue

    if (!Formulario.validarTodo(reglasRecuperar)) {
        Formulario.mostrarEstado(mensajeRecuperar, "Revisa el correo ingresado.", "error");
        return;
    }

    Formulario.mostrarEstado(
        mensajeRecuperar,
        `Simulación completada: enviaríamos las instrucciones a ${inputCorreo.value.trim()}. ` +
        "No se envió ningún correo ni se modificó ninguna contraseña.",
        "exito"
    );
});
