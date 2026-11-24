/* ==========================================================
   MESAVERSO — SEMANA 3
   js/formulario-s3.js · Mostrar en pantalla el resultado de validar

   Es la parte de PRESENTACIÓN. Las reglas están en validaciones-s3.js.
   Se reutiliza en login, recuperar, perfil, carrito y administración
   con la misma lógica que ya tenía registro.js en la Semana 2:
   - clases de Bootstrap is-valid / is-invalid,
   - atributo aria-invalid,
   - mensaje específico debajo del campo (div#error-<id del input>),
   - foco en el primer campo con error.
   ========================================================== */

const Formulario = (function () {
    "use strict";

    // Pinta un campo como correcto o incorrecto y escribe su mensaje.
    function pintarCampo(input, mensajeError) {
        const cajaError = document.getElementById("error-" + input.id);

        input.classList.toggle("is-invalid", mensajeError !== "");
        input.classList.toggle("is-valid", mensajeError === "");
        input.setAttribute("aria-invalid", mensajeError !== "" ? "true" : "false");

        if (cajaError) cajaError.textContent = mensajeError;
    }

    // Quita colores y mensajes de un campo (al limpiar o cargar un formulario).
    function limpiarCampo(input) {
        input.classList.remove("is-valid", "is-invalid");
        input.removeAttribute("aria-invalid");
        delete input.dataset.revisado;

        const cajaError = document.getElementById("error-" + input.id);
        if (cajaError) cajaError.textContent = "";
    }

    // Recibe un objeto { idDelInput: funciónQueValida } y revisa todos los campos.
    // Devuelve true si todo está correcto. Si no, pone el foco en el primer error.
    function validarTodo(reglas) {
        let primerError = null;

        Object.keys(reglas).forEach(function (id) {
            const input = document.getElementById(id);
            const error = reglas[id](input.value);

            input.dataset.revisado = "si";
            pintarCampo(input, error);

            if (error && primerError === null) primerError = input;
        });

        if (primerError) primerError.focus();
        return primerError === null;
    }

    // Validación en vivo (igual que en registro.js):
    // la primera vez se valida al salir del campo (blur) y desde ahí
    // se vuelve a validar mientras la persona escribe (input).
    function validarEnVivo(reglas) {
        Object.keys(reglas).forEach(function (id) {
            const input = document.getElementById(id);
            const evento = input.tagName === "SELECT" ? "change" : "input";

            input.addEventListener("blur", function (evento) {
                // Si el foco pasa al botón de enviar, no se valida aquí: al aparecer
                // el mensaje de error el botón se movería y el clic se perdería.
                // El evento submit validará todo de todas formas.
                const destino = evento.relatedTarget;
                if (destino && destino.type === "submit") return;

                input.dataset.revisado = "si";
                pintarCampo(input, reglas[id](input.value));
            });

            input.addEventListener(evento, function () {
                if (input.dataset.revisado === "si") {
                    pintarCampo(input, reglas[id](input.value));
                }
            });
        });
    }

    // Limpia todos los campos indicados en las reglas.
    function limpiarTodo(reglas) {
        Object.keys(reglas).forEach(function (id) {
            limpiarCampo(document.getElementById(id));
        });
    }

    // Mensaje general del formulario. Usa las clases .form-status de styles.css
    // tipo: "exito" (verde) o "error" (rojo).
    function mostrarEstado(elemento, texto, tipo) {
        elemento.textContent = texto;
        elemento.className = "form-status " + tipo;
    }

    function limpiarEstado(elemento) {
        elemento.textContent = "";
        elemento.className = "form-status";
    }

    // Botón "Ver / Ocultar" para un campo de contraseña.
    function activarVerClave(boton, input) {
        boton.addEventListener("click", function () {
            const oculta = input.type === "password";
            input.type = oculta ? "text" : "password";
            boton.textContent = oculta ? "Ocultar" : "Ver";
            boton.setAttribute("aria-pressed", String(oculta));
            boton.setAttribute("aria-label", oculta ? "Ocultar contraseña" : "Mostrar contraseña");
        });
    }

    // Marca en verde las reglas de contraseña que ya se cumplen.
    // La lista HTML usa <li data-regla="minimo|maximo|mayuscula|numero|especial">.
    function pintarReglasClave(lista, clave) {
        const estado = Validaciones.revisarClave(clave);
        lista.querySelectorAll("li").forEach(function (item) {
            // "maximo" solo se marca como cumplida cuando ya se escribió algo
            const cumple = estado[item.dataset.regla] && clave.length > 0;
            item.classList.toggle("ok", cumple);
        });
    }

    return {
        pintarCampo, limpiarCampo, validarTodo, validarEnVivo, limpiarTodo,
        mostrarEstado, limpiarEstado, activarVerClave, pintarReglasClave
    };
})();
