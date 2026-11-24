# MesaVerso

Tienda virtual de juegos de mesa desarrollada como proyecto académico para FullStack II (DSY2202), Duoc UC.

## Tecnologías

- Angular 21 y TypeScript
- Bootstrap 5
- Jasmine y Karma para pruebas unitarias

## Funcionalidades

- Catálogo de juegos, categorías y ofertas.
- Carrito de compras, confirmación e historial de pedidos.
- Registro, inicio de sesión, recuperación de contraseña y perfil.
- Panel de administración para datos de demostración.

## Ejecutar

Desde la raíz del proyecto:

```powershell
npm ci
npm start
```

La aplicación se abrirá en `http://localhost:4200`.

## Pruebas

Para ejecutar Jasmine/Karma en Chrome con observación de cambios:

```powershell
npm test
```

Para una ejecución puntual sin interfaz gráfica:

```powershell
npm test -- --watch=false --browsers=ChromeHeadlessCI
```

## Alcance

Es una simulación educativa que usa almacenamiento local. No cuenta con backend, base de datos externa, autenticación real ni envío de correos.
