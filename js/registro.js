/* ==========================================================
   MESAVERSO — SEMANA 2
   js/registro.js · Validaciones del formulario de registro

   Reglas pedidas por el cliente:
   1. Ningún campo puede quedar vacío (excepto la dirección).
   2. El correo debe tener formato de email.
   3. Las dos contraseñas deben ser iguales.
   4. La contraseña debe tener al menos un número y una mayúscula.
   5. La contraseña debe medir entre 6 y 18 caracteres.
   6. La persona debe tener 13 años o más.
   7. La dirección de despacho es opcional.

   Nota: el formulario NO guarda ni envía datos; solo valida
   en el navegador (sitio académico).
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

const EDAD_MINIMA = 13;


/* ==================== 2. FUNCIONES DE APOYO ==================== */

// Devuelve true si el texto está vacío o solo tiene espacios
function estaVacio(valor) {
    return valor.trim() === "";
}

// Formato de email: texto@texto.dominio (sin espacios)
function esCorreoValido(correo) {
    const patron = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    return patron.test(correo.trim());
}

// Revisa cada regla de la contraseña por separado
function revisarClave(clave) {
    return {
        largo: clave.length >= 6 && clave.length <= 18,
        mayuscula: /[A-ZÑ]/.test(clave),
        numero: /[0-9]/.test(clave)
    };
}

// Calcula la edad en años cumplidos a partir de "aaaa-mm-dd"
function calcularEdad(fechaTexto) {
    const [anio, mes, dia] = fechaTexto.split("-").map(Number);
    const nacimiento = new Date(anio, mes - 1, dia);
    const hoy = new Date();

    let edad = hoy.getFullYear() - nacimiento.getFullYear();

    // Si todavía no llega su cumpleaños este año, se resta 1
    const yaCumplio =
        hoy.getMonth() > nacimiento.getMonth() ||
        (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() >= nacimiento.getDate());

    if (!yaCumplio) {
        edad--;
    }

    return edad;
}

// Fecha de hoy en formato "aaaa-mm-dd" (para el atributo max del input date)
function fechaHoyTexto() {
    const hoy = new Date();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");
    return `${hoy.getFullYear()}-${mes}-${dia}`;
}


/* ==================== 3. VALIDACIÓN DE CADA CAMPO ==================== */
// Cada función devuelve el mensaje de error, o "" si el campo está correcto.

const validadores = {

    nombre(valor) {
        if (estaVacio(valor)) return "Ingresa tu nombre completo.";
        return "";
    },

    usuario(valor) {
        if (estaVacio(valor)) return "Ingresa un nombre de usuario.";
        if (/\s/.test(valor.trim())) return "El nombre de usuario no puede tener espacios.";
        return "";
    },

    correo(valor) {
        if (estaVacio(valor)) return "Ingresa tu correo electrónico.";
        if (!esCorreoValido(valor)) return "El correo no tiene un formato válido (ej: nombre@correo.cl).";
        return "";
    },

    clave(valor) {
        if (valor === "") return "Ingresa una contraseña.";
        const reglas = revisarClave(valor);
        if (!reglas.largo) return "La contraseña debe tener entre 6 y 18 caracteres.";
        if (!reglas.mayuscula) return "La contraseña debe tener al menos una letra mayúscula.";
        if (!reglas.numero) return "La contraseña debe tener al menos un número.";
        return "";
    },

    clave2(valor) {
        if (valor === "") return "Repite tu contraseña.";
        if (valor !== inputs.clave.value) return "Las contraseñas no coinciden.";
        return "";
    },

    nacimiento(valor) {
        if (valor === "") return "Ingresa tu fecha de nacimiento.";
        const edad = calcularEdad(valor);
        if (Number.isNaN(edad)) return "La fecha no es válida.";
        if (edad < 0) return "La fecha de nacimiento no puede ser futura.";
        if (edad < EDAD_MINIMA) return `Debes tener al menos ${EDAD_MINIMA} años para registrarte.`;
        return "";
    }
};


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
    const estado = revisarClave(inputs.clave.value);

    reglasClave.forEach(function (item) {
        const regla = item.dataset.regla;
        item.classList.toggle("ok", estado[regla]);
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


/* ==================== 5. EVENTOS ==================== */

// 5.1 Al cargar: la fecha de nacimiento no puede ser posterior a hoy
inputs.nacimiento.setAttribute("max", fechaHoyTexto());

// 5.2 Validación en vivo: al salir del campo (blur) se valida por primera vez;
//     desde ahí, se vuelve a validar mientras la persona escribe (input).
Object.keys(inputs).forEach(function (nombreCampo) {
    const input = inputs[nombreCampo];

    input.addEventListener("blur", function () {
        input.dataset.revisado = "si";
        validarCampo(nombreCampo);
    });

    input.addEventListener("input", function () {
        if (input.dataset.revisado === "si") {
            validarCampo(nombreCampo);
        }
    });
});

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

    // La dirección es opcional: no se valida, solo se marca si fue escrita
    if (!estaVacio(direccion.value)) {
        direccion.classList.add("is-valid");
    }

    if (todoCorrecto) {
        const usuario = inputs.usuario.value.trim();
        mostrarMensaje(
            `¡Registro validado, ${usuario}! Bienvenida/o al Club MesaVerso. ` +
            "(Sitio académico: los datos no se guardan.)",
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

    direccion.classList.remove("is-valid");

    // Volver a ocultar la contraseña
    inputs.clave.type = "password";
    btnVerClave.textContent = "Ver";
    btnVerClave.setAttribute("aria-pressed", "false");

    // Las reglas se actualizan cuando el reset ya vació los campos
    setTimeout(actualizarReglasClave, 0);

    limpiarMensaje();
    inputs.nombre.focus();
});
