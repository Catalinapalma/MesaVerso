/* ==========================================================
   MESAVERSO — SEMANA 2 (actualizado en SEMANA 3)
   js/registro.js · Validaciones del formulario de registro

   Reglas pedidas por el cliente:
   1. Ningún campo puede quedar vacío (excepto la dirección).
   2. El correo debe tener formato de email.
   3. Las dos contraseñas deben ser iguales.
   4. La contraseña debe tener al menos un número y una mayúscula.
   5. La contraseña debe medir entre 6 y 18 caracteres.
   6. La persona debe tener 13 años o más.
   7. La dirección de despacho es opcional.

   CAMBIOS DE LA SEMANA 3 (según el feedback de la Semana 2):
   - Las REGLAS ahora están en js/validaciones-s3.js y se reutilizan
     en login, recuperar, perfil, carrito y administración.
     Este archivo se queda con la PRESENTACIÓN y los eventos.
   - Se agregó una 5.ª regla de contraseña: un carácter especial.
   - Se valida que el correo y el usuario no estén ya registrados.
   - Los datos validados se reúnen en un objeto (datosRegistro) y se
     guardan como ficha de cliente y de usuario en localStorage.
     La contraseña NUNCA se guarda.
   ========================================================== */


/* ==================== 1. ELEMENTOS DEL DOM ==================== */

const form = document.getElementById("formRegistro");
const mensajeFormulario = document.getElementById("mensajeFormulario");
const btnVerClave = document.getElementById("btnVerClave");
const reglasClave = document.querySelectorAll("#reglas-clave li");

// Campos obligatorios (la dirección no está porque es opcional)
const inputs = {
    nombre: document.getElementById("nombre"),
    usuario: document.getElementById("usuario"),
    correo: document.getElementById("correo"),
    clave: document.getElementById("clave"),
    clave2: document.getElementById("clave2"),
    nacimiento: document.getElementById("nacimiento")
};

const direccion = document.getElementById("direccion");



/* ==================== 2. FUNCIONES DE APOYO ==================== */
// S3: las funciones estaVacio, esCorreoValido, revisarClave, calcularEdad
// y fechaHoyTexto se trasladaron a js/validaciones-s3.js (objeto Validaciones)
// para poder reutilizarlas en todos los formularios del sitio.

// Devuelve true si ya existe una ficha con ese valor (correo o usuario)
function yaRegistrado(propiedad, valor) {
    return MV.usuarios().some(function (usuario) {
        return String(usuario[propiedad]).toLowerCase() === valor.trim().toLowerCase();
    });
}


/* ==================== 3. VALIDACIÓN DE CADA CAMPO ==================== */
// Cada función devuelve el mensaje de error, o "" si el campo está correcto.

const validadores = {

    // S3: además de las reglas S2, el nombre solo admite letras
    nombre(valor) {
        return Validaciones.validarNombre(valor);
    },

    // S3: el usuario no puede estar ocupado por otra ficha
    usuario(valor) {
        const error = Validaciones.validarUsuario(valor);
        if (error) return error;
        if (yaRegistrado("usuario", valor)) return "Ese nombre de usuario ya está registrado.";
        return "";
    },

    // S3: el correo no puede estar registrado
    correo(valor) {
        const error = Validaciones.validarCorreo(valor);
        if (error) return error;
        if (yaRegistrado("correo", valor)) return "Ya existe una cuenta con ese correo.";
        return "";
    },

    clave(valor) {
        return Validaciones.validarClave(valor);
    },

    clave2(valor) {
        return Validaciones.validarRepeticion(valor, inputs.clave.value);
    },

    nacimiento(valor) {
        return Validaciones.validarNacimiento(valor);
    }
};

// S3: la dirección es opcional, pero si se escribe debe tener un largo razonable
function validarDireccionOpcional() {
    const error = Validaciones.validarDireccion(direccion.value, false);
    const cajaError = document.getElementById("error-direccion");

    direccion.classList.toggle("is-invalid", error !== "");
    direccion.classList.toggle("is-valid", error === "" && !Validaciones.estaVacio(direccion.value));
    cajaError.textContent = error;
    return error === "";
}


/* ==================== 4. MOSTRAR RESULTADO EN PANTALLA ==================== */
// Manipulación del DOM: se cambian clases de Bootstrap (is-valid / is-invalid),
// el texto del mensaje de error y el atributo aria-invalid.

function pintarCampo(input, mensajeError) {
    const cajaError = document.getElementById("error-" + input.id);

    if (mensajeError) {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
        input.setAttribute("aria-invalid", "true");
    } else {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        input.setAttribute("aria-invalid", "false");
    }

    cajaError.textContent = mensajeError;
}

function validarCampo(nombreCampo) {
    const input = inputs[nombreCampo];
    const error = validadores[nombreCampo](input.value);
    pintarCampo(input, error);
    return error === "";
}

// Marca en verde las reglas de la contraseña que ya se cumplen
function actualizarReglasClave() {
    const estado = Validaciones.revisarClave(inputs.clave.value);

    reglasClave.forEach(function (item) {
        const regla = item.dataset.regla;
        // "maximo" se marca solo cuando ya se escribió algo
        item.classList.toggle("ok", estado[regla] && inputs.clave.value.length > 0);
    });
}

function mostrarMensaje(texto, tipo) {
    mensajeFormulario.textContent = texto;
    mensajeFormulario.className = "form-status " + tipo; // "exito" o "error"
}

function limpiarMensaje() {
    mensajeFormulario.textContent = "";
    mensajeFormulario.className = "form-status";
}


/* ==================== 4.1 S3 · DATOS VALIDADOS ==================== */

// Reúne los datos ya validados en un solo objeto. La contraseña NO se incluye.
function obtenerDatosRegistro() {
    return {
        nombre: inputs.nombre.value.trim(),
        usuario: inputs.usuario.value.trim(),
        correo: inputs.correo.value.trim().toLowerCase(),
        nacimiento: inputs.nacimiento.value,
        direccion: direccion.value.trim()
    };
}

// Guarda la persona como ficha de usuario (rol cliente) y como ficha de cliente.
function guardarRegistro(datos) {
    const usuarios = MV.usuarios();
    usuarios.push({
        id: MV.siguienteId(usuarios),
        nombre: datos.nombre,
        usuario: datos.usuario,
        correo: datos.correo,
        rol: "cliente"
    });
    MV.guardar("usuarios", usuarios);

    const clientes = MV.clientes();
    clientes.push({
        id: MV.siguienteId(clientes),
        nombre: datos.nombre,
        correo: datos.correo,
        telefono: "",
        direccion: datos.direccion
    });
    MV.guardar("clientes", clientes);
}


/* ==================== 5. EVENTOS ==================== */

// 5.1 Al cargar: la fecha de nacimiento no puede ser posterior a hoy
inputs.nacimiento.setAttribute("max", Validaciones.fechaHoyTexto());

// 5.2 Validación en vivo: al salir del campo (blur) se valida por primera vez;
//     desde ahí, se vuelve a validar mientras la persona escribe (input).
Object.keys(inputs).forEach(function (nombreCampo) {
    const input = inputs[nombreCampo];

    input.addEventListener("blur", function (evento) {
        // S3: si el foco pasa al botón "Registrarme" no se valida aquí, porque el
        // mensaje de error movería el botón y el clic se perdería (submit valida todo).
        if (evento.relatedTarget && evento.relatedTarget.type === "submit") return;

        input.dataset.revisado = "si";
        validarCampo(nombreCampo);
    });

    input.addEventListener("input", function () {
        if (input.dataset.revisado === "si") {
            validarCampo(nombreCampo);
        }
    });
});

// 5.2.1 S3: la dirección (opcional) también se valida al salir del campo
direccion.addEventListener("blur", validarDireccionOpcional);

// 5.3 Si cambia la contraseña: se actualiza la lista de reglas y,
//     si ya se escribió la repetición, se vuelve a comparar.
inputs.clave.addEventListener("input", function () {
    actualizarReglasClave();

    if (inputs.clave2.dataset.revisado === "si") {
        validarCampo("clave2");
    }
});

// 5.4 Botón "Ver": cambia el atributo type del input de contraseña
btnVerClave.addEventListener("click", function () {
    const oculta = inputs.clave.type === "password";

    inputs.clave.type = oculta ? "text" : "password";
    btnVerClave.textContent = oculta ? "Ocultar" : "Ver";
    btnVerClave.setAttribute("aria-pressed", String(oculta));
    btnVerClave.setAttribute("aria-label", oculta ? "Ocultar contraseña" : "Mostrar contraseña");
});

// 5.5 Botón "Registrarme" (submit)
form.addEventListener("submit", function (evento) {
    evento.preventDefault(); // Evita que la página se recargue

    let todoCorrecto = true;
    let primerError = null;

    Object.keys(inputs).forEach(function (nombreCampo) {
        inputs[nombreCampo].dataset.revisado = "si";
        const valido = validarCampo(nombreCampo);

        if (!valido) {
            todoCorrecto = false;
            if (primerError === null) primerError = inputs[nombreCampo];
        }
    });

    // La dirección es opcional: solo se valida si fue escrita (S3)
    if (!validarDireccionOpcional()) {
        todoCorrecto = false;
        if (primerError === null) primerError = direccion;
    }

    if (todoCorrecto) {
        // S3: los datos validados quedan separados en un objeto (sin la contraseña)
        const datosRegistro = obtenerDatosRegistro();
        guardarRegistro(datosRegistro);

        mostrarMensaje(
            `¡Registro exitoso, ${datosRegistro.usuario}! Bienvenida/o al Club MesaVerso. ` +
            "Tu ficha quedó guardada en este navegador (el administrador la ve en su panel). " +
            "Para probar las compras, inicia sesión con la cuenta de prueba cliente@mesaverso.cl.",
            "exito"
        );
    } else {
        mostrarMensaje("Revisa los campos marcados en rojo e inténtalo nuevamente.", "error");
        primerError.focus();
    }
});

// 5.6 Botón "Limpiar formulario" (reset)
//     El navegador borra los valores; JavaScript borra las clases y mensajes.
form.addEventListener("reset", function () {
    Object.values(inputs).forEach(function (input) {
        input.classList.remove("is-valid", "is-invalid");
        input.removeAttribute("aria-invalid");
        delete input.dataset.revisado;
        document.getElementById("error-" + input.id).textContent = "";
    });

    direccion.classList.remove("is-valid", "is-invalid");
    document.getElementById("error-direccion").textContent = "";

    // Volver a ocultar la contraseña
    inputs.clave.type = "password";
    btnVerClave.textContent = "Ver";
    btnVerClave.setAttribute("aria-pressed", "false");

    // Las reglas se actualizan cuando el reset ya vació los campos
    setTimeout(actualizarReglasClave, 0);

    limpiarMensaje();
    inputs.nombre.focus();
});
