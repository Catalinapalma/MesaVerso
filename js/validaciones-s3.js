/* ==========================================================
   MESAVERSO — SEMANA 3
   js/validaciones-s3.js · Reglas de validación reutilizables

   Mejora pedida en el feedback de la Semana 2: separar las REGLAS
   (qué dato es correcto) de la PRESENTACIÓN (cómo se muestra el error).

   - Este archivo NO toca el DOM: solo recibe textos y devuelve resultados.
   - Cada función "validar..." devuelve el mensaje de error, o "" si el
     dato es correcto. Así cualquier formulario puede reutilizarlas.
   - La forma de mostrar los mensajes está en js/formulario-s3.js.

   Lo usan: registro, login, recuperar, perfil, carrito y administración.
   ========================================================== */

const Validaciones = (function () {
    "use strict";

    const EDAD_MINIMA = 13;
    const CLAVE_MIN = 6;
    const CLAVE_MAX = 18;

    // Formato de email: texto@texto.dominio (sin espacios)
    const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

    // Teléfono chileno: +56 9 1234 5678 o 9 1234 5678 (se ignoran espacios)
    const PATRON_TELEFONO = /^(\+?56)?9\d{8}$/;

    // Solo letras (con tildes y ñ) y espacios
    const PATRON_NOMBRE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' ]+$/;


    /* ==================== 1. FUNCIONES BÁSICAS ==================== */

    // Devuelve true si el texto está vacío o solo tiene espacios
    function estaVacio(valor) {
        return String(valor).trim() === "";
    }

    // Devuelve true si el correo tiene un formato válido
    function esCorreoValido(correo) {
        return PATRON_CORREO.test(String(correo).trim());
    }

    // Revisa cada regla de seguridad de la contraseña por separado.
    // Devuelve un objeto { regla: true/false } para poder pintar la lista
    // de requisitos en pantalla mientras se escribe.
    function revisarClave(clave) {
        return {
            minimo:    clave.length >= CLAVE_MIN,          // 1. longitud mínima
            maximo:    clave.length <= CLAVE_MAX,          // 2. longitud máxima
            mayuscula: /[A-ZÑ]/.test(clave),               // 3. una mayúscula
            numero:    /[0-9]/.test(clave),                // 4. un número
            especial:  /[^A-Za-z0-9ÑñÁÉÍÓÚáéíóú\s]/.test(clave) // 5. un carácter especial
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

        if (!yaCumplio) edad--;
        return edad;
    }

    // Fecha de hoy en formato "aaaa-mm-dd" (para el atributo max de un input date)
    function fechaHoyTexto() {
        const hoy = new Date();
        const mes = String(hoy.getMonth() + 1).padStart(2, "0");
        const dia = String(hoy.getDate()).padStart(2, "0");
        return `${hoy.getFullYear()}-${mes}-${dia}`;
    }


    /* ==================== 2. VALIDADORES DE CAMPOS ==================== */
    // Cada uno devuelve "" (correcto) o el texto del error.

    // Nombre completo: obligatorio, solo letras, entre 3 y 60 caracteres
    function validarNombre(valor) {
        const texto = valor.trim();
        if (texto === "") return "Ingresa el nombre completo.";
        if (texto.length < 3) return "El nombre debe tener al menos 3 caracteres.";
        if (texto.length > 60) return "El nombre no puede superar los 60 caracteres.";
        if (!PATRON_NOMBRE.test(texto)) return "El nombre solo puede contener letras y espacios.";
        return "";
    }

    // Nombre de usuario: obligatorio, sin espacios, entre 4 y 20 caracteres
    function validarUsuario(valor) {
        const texto = valor.trim();
        if (texto === "") return "Ingresa un nombre de usuario.";
        if (/\s/.test(texto)) return "El nombre de usuario no puede tener espacios.";
        if (texto.length < 4 || texto.length > 20) return "El usuario debe tener entre 4 y 20 caracteres.";
        return "";
    }

    // Correo: obligatorio y con formato válido
    function validarCorreo(valor) {
        if (estaVacio(valor)) return "Ingresa el correo electrónico.";
        if (!esCorreoValido(valor)) return "El correo no tiene un formato válido (ej: nombre@correo.cl).";
        return "";
    }

    // Contraseña: obligatoria y con las 5 reglas de seguridad
    function validarClave(valor) {
        if (valor === "") return "Ingresa una contraseña.";
        if (/\s/.test(valor)) return "La contraseña no puede contener espacios.";
        const reglas = revisarClave(valor);
        if (!reglas.minimo) return `La contraseña debe tener al menos ${CLAVE_MIN} caracteres.`;
        if (!reglas.maximo) return `La contraseña no puede superar los ${CLAVE_MAX} caracteres.`;
        if (!reglas.mayuscula) return "La contraseña debe tener al menos una letra mayúscula.";
        if (!reglas.numero) return "La contraseña debe tener al menos un número.";
        if (!reglas.especial) return "La contraseña debe tener al menos un carácter especial (ej: ! # $ %).";
        return "";
    }

    // Repetir contraseña: obligatoria e igual a la primera
    function validarRepeticion(repetida, original) {
        if (repetida === "") return "Repite la contraseña.";
        if (repetida !== original) return "Las contraseñas no coinciden.";
        return "";
    }

    // Fecha de nacimiento: obligatoria, no futura y con edad mínima
    function validarNacimiento(valor) {
        if (valor === "") return "Ingresa tu fecha de nacimiento.";
        const edad = calcularEdad(valor);
        if (Number.isNaN(edad)) return "La fecha no es válida.";
        if (edad < 0) return "La fecha de nacimiento no puede ser futura.";
        if (edad < EDAD_MINIMA) return `Debes tener al menos ${EDAD_MINIMA} años para registrarte.`;
        if (edad > 120) return "Revisa el año de nacimiento.";
        return "";
    }

    // Teléfono: OPCIONAL, pero si se escribe debe ser un celular chileno
    function validarTelefono(valor) {
        const limpio = valor.replace(/\s/g, "");
        if (limpio === "") return "";
        if (!PATRON_TELEFONO.test(limpio)) return "Escribe un celular válido (ej: +56912345678).";
        return "";
    }

    // Dirección: obligatoria u opcional según el formulario
    function validarDireccion(valor, obligatoria) {
        const texto = valor.trim();
        if (texto === "") return obligatoria ? "Ingresa la dirección de despacho." : "";
        if (texto.length < 5) return "La dirección es demasiado corta (mínimo 5 caracteres).";
        if (texto.length > 100) return "La dirección no puede superar los 100 caracteres.";
        return "";
    }

    // Texto libre con largo mínimo y máximo (descripciones, nombres de producto)
    function validarTexto(valor, minimo, maximo, etiqueta) {
        const texto = valor.trim();
        if (texto === "") return `Ingresa ${etiqueta}.`;
        if (texto.length < minimo) return `Debe tener al menos ${minimo} caracteres.`;
        if (texto.length > maximo) return `No puede superar los ${maximo} caracteres.`;
        return "";
    }

    // Número entero dentro de un rango (precio, stock, cantidad)
    function validarEntero(valor, minimo, maximo, etiqueta) {
        if (String(valor).trim() === "") return `Ingresa ${etiqueta}.`;
        const numero = Number(valor);
        if (!Number.isInteger(numero)) return "Debe ser un número entero, sin decimales.";
        if (numero < minimo) return `Debe ser ${minimo} o más.`;
        if (numero > maximo) return `No puede superar ${maximo}.`;
        return "";
    }

    // Lista desplegable: el valor elegido debe estar entre las opciones válidas
    function validarOpcion(valor, opciones, etiqueta) {
        if (!opciones.includes(valor)) return `Selecciona ${etiqueta}.`;
        return "";
    }


    // Lo que otros archivos pueden usar
    return {
        EDAD_MINIMA, CLAVE_MIN, CLAVE_MAX,
        estaVacio, esCorreoValido, revisarClave, calcularEdad, fechaHoyTexto,
        validarNombre, validarUsuario, validarCorreo, validarClave, validarRepeticion,
        validarNacimiento, validarTelefono, validarDireccion,
        validarTexto, validarEntero, validarOpcion
    };
})();
