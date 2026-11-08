# MesaVerso 🎲

Tienda académica de juegos de mesa — FullStack II (DSY2202).

Nombre: Catalina Palma

---

## Semana 3 — Desarrollando nuestro primer FrontEnd

MesaVerso continúa el mismo proyecto de las semanas 1 y 2 y agrega cuentas ficticias, **dos roles**, carrito, pago simulado, historial, recuperación de contraseña, perfil y mantenedores de administración.

**Temática:** venta de juegos de mesa.
**Tecnologías:** HTML5, CSS3, Bootstrap 5.3.6 (local, en `vendor/`) y JavaScript.
**No incluye:** servidor, base de datos, API ni pagos reales. Todo es una simulación en el navegador.

### Cómo abrirlo

1. Abre la carpeta `MesaVerso` en Visual Studio Code.
2. Abre `index.html` con **Live Server**. Así localStorage y sessionStorage se comparten bien entre páginas; con `file://` algunos navegadores lo limitan.
3. Para volver a los datos iniciales, entra como administrador y presiona **Restablecer datos de demostración**.

### Cuentas de prueba (ficticias)

| Rol | Correo | Contraseña | Qué puede hacer |
| --- | --- | --- | --- |
| Cliente | `cliente@mesaverso.cl` | `Cliente123!` | Comprar, ver carrito, pagar (simulado), ver *Mis compras*, editar perfil |
| Administrador | `admin@mesaverso.cl` | `Admin123!` | Gestionar productos, inventario, clientes, usuarios y pedidos, editar perfil |

En `login.html` hay botones **Usar cuenta…** que completan los campos.

### Diferencias entre roles

| Elemento | Invitado | Cliente | Administrador |
| --- | --- | --- | --- |
| Menú | INGRESAR, REGISTRO | CARRITO (con contador), MIS COMPRAS, PERFIL, SALIR | ADMINISTRAR, PERFIL, SALIR |
| Botón en cada juego | «Ingresa para comprar» → login | «Agregar al carrito» | «Editar en el panel» → admin |
| `carrito.html`, `historial.html` | Redirige a login | ✔ | Redirige a login |
| `admin.html` | Redirige a login | Redirige a login | ✔ |

---

## Páginas

| Página | Estado | Qué hace |
| --- | --- | --- |
| `index.html` | S1/S2 + S3 | Portada. La sugerencia aleatoria ahora usa los datos del catálogo |
| `categorias.html` | S1/S2 | Las 4 categorías |
| `estrategia.html`, `familiares.html`, `cartas.html`, `cooperativos.html` | S1/S2 + S3 | Catálogo con stock y botón de compra según el rol |
| `ofertas.html` | S1/S2 + S3 | Muestra **todos** los juegos con precio de oferta |
| `registro.html` | S2 + S3 | Registro con 5 reglas de contraseña; guarda la ficha sin la contraseña |
| `login.html` | **Nueva** | Inicio de sesión con validaciones |
| `recuperar.html` | **Nueva** | Valida el correo y muestra un mensaje simulado |
| `perfil.html` | **Nueva** | Modificación de nombre, usuario, teléfono y dirección |
| `carrito.html` | **Nueva** | Cantidades, total y pago simulado |
| `confirmacion.html` | **Nueva** | Detalle del pedido recién pagado |
| `historial.html` | **Nueva** | Compras del cliente actual |
| `admin.html` | **Nueva** | Mantenedores de productos/inventario, clientes, usuarios y pedidos |

---

## Organización de archivos

```
MesaVerso/
├── *.html                 15 páginas en la raíz
├── css/
│   ├── styles.css         Estilos S1/S2 (sin cambios)
│   └── s3.css             Estilos nuevos S3 (menú por rol, carrito, tablas...)
├── js/
│   ├── main.js            S2 · menú activo, año del pie, sombra del menú
│   ├── inicio.js          S2 · sugerencia aleatoria (S3: lee los datos del catálogo)
│   ├── catalogo.js        S2 · buscador (S3: incluye fichas nuevas)
│   ├── registro.js        S2 · registro (S3: usa validaciones-s3.js y guarda la ficha)
│   ├── datos-s3.js        Datos ficticios + localStorage/sessionStorage (objeto MV)
│   ├── validaciones-s3.js REGLAS de validación reutilizables (objeto Validaciones)
│   ├── formulario-s3.js   PRESENTACIÓN de errores en pantalla (objeto Formulario)
│   ├── sesion-s3.js       Menú según rol, contador del carrito, botón SALIR
│   ├── login-s3.js        Inicio de sesión
│   ├── recuperar-s3.js    Recuperar contraseña
│   ├── perfil-s3.js       Modificar perfil
│   ├── catalogo-s3.js     Une las fichas HTML con los datos + botón de carrito
│   ├── carrito-s3.js      Carrito y pago simulado
│   ├── confirmacion-s3.js Detalle del último pedido
│   ├── historial-s3.js    Mis compras
│   └── admin-s3.js        Panel de administración
├── img/                   12 imágenes PNG + favicon.svg
└── vendor/                Bootstrap 5.3.6 local
```

**Orden de carga de los scripts** (al final del `<body>`): Bootstrap → `datos-s3.js` → `sesion-s3.js` → `main.js` → `validaciones-s3.js` → `formulario-s3.js` → el script de la página. Los archivos de abajo usan lo que definen los de arriba.

---

## Cómo funciona cada parte (para explicar en el video)

### 1. Datos (`datos-s3.js`)
- Los productos, clientes, usuarios y pedidos son **arreglos de objetos**.
- `MV.leer()` lee de localStorage con `JSON.parse`. Si no hay nada guardado, entrega una copia de los datos iniciales.
- `MV.guardar()` guarda con `JSON.stringify`.
- La sesión (rol, correo y nombre) se guarda en **sessionStorage**, que dura lo que dura la pestaña. La contraseña **nunca** se guarda.
- `MV.exigir(["cliente"])` envía al login si el rol actual no puede ver la página.

### 2. Validaciones (`validaciones-s3.js` + `formulario-s3.js`)
Responde al feedback de la Semana 2: **separar reglas de presentación**.
- `Validaciones.validarCorreo(valor)` devuelve `""` si el dato es correcto o el texto del error. No toca el DOM.
- `Formulario.validarTodo(reglas)` recorre los campos, pone las clases `is-valid` / `is-invalid` y el atributo `aria-invalid`, escribe el mensaje y lleva el foco al primer error.
- **5 reglas de contraseña:** mínimo 6, máximo 18, una mayúscula, un número y un carácter especial. Se usan en el registro.

| Formulario | Validaciones |
| --- | --- |
| Registro | Nombre (solo letras), usuario (sin espacios, 4–20, no repetido), correo (formato, no repetido), 5 reglas de clave, repetición, edad ≥ 13, dirección opcional (si se escribe, mínimo 5) |
| Login | Correo con formato, clave obligatoria, cuenta existente |
| Recuperar | Correo con formato y registrado |
| Perfil | Nombre, usuario no repetido, teléfono celular chileno (opcional), dirección (opcional) |
| Carrito / pago | Carrito con productos, dirección obligatoria, medio de pago elegido, aceptar que es una demo, stock suficiente |
| Admin · producto | Nombre 3–40 y no repetido, categoría, imagen, precio entero ≥ 1000, oferta opcional menor al precio, stock entero 0–999, descripción 10–120 |
| Admin · cliente / usuario | Nombre, correo con formato y no repetido, teléfono, rol; el admin no puede eliminarse ni quitarse su rol |

### 3. Catálogo y carrito
- `catalogo-s3.js` **no borra** las fichas HTML de S1/S2. Las relaciona con los datos por su nombre: actualiza precio y descripción, quita las que el admin eliminó y crea las nuevas con `createElement`.
- El carrito se guarda como `[{ id, cantidad }]`. No se puede agregar más que el stock disponible.
- Al pagar se crea un **pedido asociado al correo del cliente**, se **descuenta el stock** y se vacía el carrito.
- `historial-s3.js` usa `filter()` para mostrar solo los pedidos del correo actual y `reduce()` para los totales.

### 4. Administración (`admin-s3.js`)
- **Productos e inventario:** agregar, editar, eliminar y botones − / + de stock. Los cambios se ven al abrir la categoría.
- **Clientes y usuarios:** ambos usan una misma función, `crearMantenedor(config)`, para no repetir código.
- **Pedidos:** el admin consulta las compras de todos los clientes, cada una asociada a su correo.

---

## Pruebas rápidas (checklist de la pauta)

| Prueba | Cómo | Resultado esperado |
| --- | --- | --- |
| Registro vacío | Presionar «Registrarme» sin datos | 6 campos en rojo con su mensaje |
| Clave débil | Escribir `Clave123` | 4 de 5 reglas en verde; falta el carácter especial |
| Roles | Entrar como cliente y luego como admin | Menús y botones distintos |
| Carrito | Agregar Catan dos veces | Contador del menú en 2 |
| Stock | Comprar las 2 unidades de *La misión azul* | La ficha pasa a «Agotado» |
| Admin | Agregar un juego con oferta | Aparece en su categoría y en OFERTAS |
| Storage | F12 → Application → Local/Session Storage | Claves `mv_s3_...` |
| Responsivo | F12 → 375 px, 768 px y 1280 px | Sin desbordes; menú colapsado bajo 992 px |

---

## Guion sugerido para el video (Kaltura)

1. **Presentación:** MesaVerso, tienda de juegos de mesa, y objetivo de la semana.
2. **Navegación como invitado:** tienda, categorías, ofertas, buscador; el botón «Ingresa para comprar».
3. **Registro:** enviarlo vacío → errores; clave débil → lista de reglas; registro correcto.
4. **Login:** error con clave incorrecta; entrar como **cliente**.
5. **Cliente:** agregar juegos → contador; carrito (+ / −, total); pago sin aceptar → error; pago correcto → confirmación → *Mis compras*.
6. **Perfil:** teléfono inválido → error; guardar → el nombre cambia en el menú.
7. **Recuperar contraseña:** correo inválido o no registrado → error; correo correcto → mensaje simulado.
8. **Administrador:** menú distinto; agregar un producto con oferta → verlo en la categoría y en OFERTAS; ajustar stock; editar cliente o usuario; revisar la pestaña de pedidos.
9. **Responsivo:** F12 en los 3 tamaños.
10. **Código:** `datos-s3.js` (arreglos + Storage), `validaciones-s3.js` y `formulario-s3.js` (reglas vs. presentación), `catalogo-s3.js` o `carrito-s3.js`.
11. **Cierre:** qué es simulado (sin servidor, pago ni autenticación real) y qué aprendiste.

---

## Datos y límite de seguridad

localStorage guarda productos, clientes, usuarios, carrito y pedidos. sessionStorage guarda la sesión de la pestaña. **Cualquiera que use el navegador puede modificar ambos desde F12**, así que no son autenticación ni autorización reales. Ocultar un enlace solo cambia la interfaz.

---

## Semana 2 — Adaptando nuestra interfaz gráfica

Formulario de registro con validaciones en JavaScript, Bootstrap en todas las páginas, buscador de juegos y sugerencia aleatoria en la portada.
