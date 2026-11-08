# MesaVerso 🎲

**Tienda virtual de juegos de mesa**

Proyecto académico desarrollado para la asignatura **FullStack II (DSY2202)** de Duoc UC.

**Estudiante:** Catalina Palma  
**Tecnologías:** HTML5, CSS3, Bootstrap 5.3.6 y JavaScript.

---

## Descripción del proyecto

MesaVerso es una tienda virtual de juegos de mesa que permite explorar productos, consultar categorías y ofertas, y simular el proceso de compra.

El proyecto se desarrolla progresivamente durante las semanas de la asignatura, incorporando nuevas funcionalidades y mejoras en la experiencia del usuario.

Su diseño está inspirado en plataformas de videojuegos, utilizando una interfaz de colores oscuros, elementos visuales destacados y navegación adaptable a distintos dispositivos.

## Semana 3 — Desarrollo del FrontEnd

En esta etapa se incorporaron nuevas funcionalidades orientadas a la gestión de usuarios, compras y administración de la tienda.

### Funcionalidades implementadas

**1. Gestión de usuarios**
- Inicio de sesión con cuentas de demostración.
- Diferenciación entre los roles Cliente y Administrador.
- Formulario de registro con validaciones.
- Recuperación de contraseña simulada.
- Visualización y modificación del perfil.
- Menú de navegación adaptado al rol.

**2. Catálogo y compras**
- Visualización de productos por categoría.
- Búsqueda de juegos.
- Sección de ofertas especiales.
- Consulta de precios y disponibilidad.
- Carrito de compras con modificación de cantidades.
- Cálculo del total y simulación de pago.
- Confirmación de pedidos.
- Historial de compras del cliente.

**3. Panel de administración**
- Gestión de productos.
- Control de inventario.
- Administración de clientes y usuarios.
- Consulta y gestión de pedidos.
- Restablecimiento de datos de demostración.

**4. Diseño responsivo**
- Uso de Bootstrap y CSS.
- Adaptación de la interfaz a distintos tamaños de pantalla.
- Formularios y componentes visuales reutilizables.

## Cuentas de demostración

Para probar las funcionalidades se encuentran disponibles las siguientes cuentas ficticias:

| Rol | Correo | Contraseña |
|---|---|---|
| Cliente | `cliente@mesaverso.cl` | `Cliente123!` |
| Administrador | `admin@mesaverso.cl` | `Admin123!` |

**Cliente:** puede explorar productos, utilizar el carrito, simular compras, consultar su historial y modificar su perfil.

**Administrador:** puede acceder al panel de administración para gestionar productos, inventario, clientes, usuarios y pedidos.


## Estructura del proyecto

```text
MesaVerso/
├── index.html
├── categorias.html
├── estrategia.html
├── familiares.html
├── cartas.html
├── cooperativos.html
├── ofertas.html
├── registro.html
├── login.html
├── recuperar.html
├── perfil.html
├── carrito.html
├── confirmacion.html
├── historial.html
├── admin.html
├── css/
│   ├── styles.css
│   └── s3.css
├── js/
│   └── Archivos JavaScript del proyecto
├── img/
│   └── Imágenes de productos y recursos visuales
└── vendor/
    └── Bootstrap
```

## Almacenamiento y alcance

El proyecto utiliza **localStorage** para conservar datos ficticios de productos, usuarios y pedidos, y **sessionStorage** para manejar información de sesión.

MesaVerso corresponde a un prototipo académico de FrontEnd. No cuenta con backend, base de datos externa, autenticación real ni integración con medios de pago.

Las compras, las cuentas y las operaciones administrativas son simulaciones desarrolladas con fines educativos.

---

**Proyecto académico — FullStack II | Duoc UC | 2026**

