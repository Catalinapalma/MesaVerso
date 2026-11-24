import { Categoria, Juego } from '../models/juego';
import { Cliente, CuentaDemo, Usuario } from '../models/usuario';
import { Pedido } from '../models/pedido';

/** S4 · Datos ESTÁTICOS del catálogo: antes estaban en js/datos-s3.js.
 * Los 12 juegos conservan nombres, precios, stock, imágenes y descripciones de S3.
 * precioOferta es null cuando el juego no tiene descuento. */
export const JUEGOS_INICIALES: Juego[] = [
  { id: 1,  nombre: 'Catan',           categoria: 'Estrategia',   precio: 34990, precioOferta: 27992, stock: 8,  imagen: 'img/catan.png',       descripcion: 'Comercia, construye y desarrolla asentamientos.' },
  { id: 2,  nombre: 'Ticket to Ride',  categoria: 'Estrategia',   precio: 39990, precioOferta: 35991, stock: 5,  imagen: 'img/ticket.png',      descripcion: 'Conecta ciudades y completa rutas ferroviarias.' },
  { id: 3,  nombre: 'Ajedrez Clásico', categoria: 'Estrategia',   precio: 15990, precioOferta: null,  stock: 12, imagen: 'img/ajedrez.png',     descripcion: 'Anticipa cada movimiento para lograr el jaque mate.' },
  { id: 4,  nombre: 'Dixit',           categoria: 'Familiares',   precio: 29990, precioOferta: 25492, stock: 6,  imagen: 'img/dixit.png',       descripcion: 'Imaginación y pistas para toda la familia.' },
  { id: 5,  nombre: 'Carcassonne',     categoria: 'Familiares',   precio: 24990, precioOferta: null,  stock: 7,  imagen: 'img/carcassonne.png', descripcion: 'Crea paisajes y suma puntos con tus fichas.' },
  { id: 6,  nombre: 'Aventureros',     categoria: 'Familiares',   precio: 19990, precioOferta: 18990, stock: 3,  imagen: 'img/aventureros.png', descripcion: 'Explora caminos y cumple desafíos en grupo.' },
  { id: 7,  nombre: 'UNO',             categoria: 'Cartas',       precio: 7990,  precioOferta: null,  stock: 20, imagen: 'img/uno.png',         descripcion: 'Descarta tus cartas antes que los demás.' },
  { id: 8,  nombre: 'Dobble',          categoria: 'Cartas',       precio: 14990, precioOferta: 13491, stock: 10, imagen: 'img/dobble.png',      descripcion: 'Encuentra el símbolo repetido contra el reloj.' },
  { id: 9,  nombre: 'Virus!',          categoria: 'Cartas',       precio: 11990, precioOferta: null,  stock: 9,  imagen: 'img/virus.png',       descripcion: 'Reúne órganos sanos y evita contagios.' },
  { id: 10, nombre: 'Pandemic',        categoria: 'Cooperativos', precio: 34990, precioOferta: 29742, stock: 4,  imagen: 'img/pandemic.png',    descripcion: 'Colaboren para detener brotes por el mundo.' },
  { id: 11, nombre: 'Just One',        categoria: 'Cooperativos', precio: 21990, precioOferta: null,  stock: 6,  imagen: 'img/justone.png',     descripcion: 'Den pistas únicas para adivinar palabras.' },
  { id: 12, nombre: 'La misión azul',  categoria: 'Cooperativos', precio: 18990, precioOferta: 17091, stock: 2,  imagen: 'img/azul.png',        descripcion: 'Resuelvan juntos desafíos por turnos.' }
];

/** Las cuatro categorías. "nombre" debe coincidir con el campo "categoria" de cada juego. */
export const CATEGORIAS: Categoria[] = [
  { slug: 'estrategia',   nombre: 'Estrategia',   descripcion: 'Planifica cada jugada y piensa dos pasos antes que tus rivales.', imagen: 'img/catan.png' },
  { slug: 'familiares',   nombre: 'Familiares',   descripcion: 'Juegos para compartir en casa con todas las edades.',            imagen: 'img/dixit.png' },
  { slug: 'cartas',       nombre: 'Cartas',       descripcion: 'Partidas rápidas, fáciles de llevar y de aprender.',              imagen: 'img/uno.png' },
  { slug: 'cooperativos', nombre: 'Cooperativos', descripcion: 'Ganan o pierden juntos: la mesa es el equipo.',                  imagen: 'img/pandemic.png' }
];

/** Clientes de ejemplo (datos de contacto y despacho). */
export const CLIENTES_INICIALES: Cliente[] = [
  { id: 1, nombre: 'Cliente de prueba', correo: 'cliente@mesaverso.cl', telefono: '+56912345678', direccion: 'Av. Siempre Viva 123, Santiago' },
  { id: 2, nombre: 'Andrea Rojas',      correo: 'andrea@ejemplo.cl',    telefono: '+56987654321', direccion: 'Los Aromos 45, Valparaíso' }
];

/** Usuarios del sistema: quién es y qué rol tiene cada uno. */
export const USUARIOS_INICIALES: Usuario[] = [
  { id: 1, nombre: 'Administradora MesaVerso', usuario: 'admin_mv',   correo: 'admin@mesaverso.cl',   rol: 'administrador' },
  { id: 2, nombre: 'Cliente de prueba',        usuario: 'cliente_mv', correo: 'cliente@mesaverso.cl', rol: 'cliente' },
  { id: 3, nombre: 'Andrea Rojas',             usuario: 'andrea_r',   correo: 'andrea@ejemplo.cl',    rol: 'cliente' }
];

/** Las DOS cuentas públicas de demostración (una por rol). Ficticias: no usar claves reales. */
export const CUENTAS_DEMO: CuentaDemo[] = [
  { correo: 'cliente@mesaverso.cl', clave: 'Cliente123!', rol: 'cliente',       nombre: 'Cliente de prueba' },
  { correo: 'admin@mesaverso.cl',   clave: 'Admin123!',   rol: 'administrador', nombre: 'Administradora MesaVerso' }
];

/** Pedidos de ejemplo para demostrar el filtro por correo en el historial. */
export const PEDIDOS_INICIALES: Pedido[] = [
  {
    id: 1, correo: 'cliente@mesaverso.cl', cliente: 'Cliente de prueba',
    items: [{ id: 3, nombre: 'Ajedrez Clásico', cantidad: 1, precio: 15990 }],
    total: 15990, fecha: '2026-11-01', estado: 'Entregado (ejemplo)',
    despacho: 'Av. Siempre Viva 123, Santiago', pago: 'Débito (simulado)'
  },
  {
    id: 2, correo: 'andrea@ejemplo.cl', cliente: 'Andrea Rojas',
    items: [{ id: 7, nombre: 'UNO', cantidad: 2, precio: 7990 }],
    total: 15980, fecha: '2026-11-03', estado: 'Entregado (ejemplo)',
    despacho: 'Los Aromos 45, Valparaíso', pago: 'Transferencia (simulada)'
  }
];
