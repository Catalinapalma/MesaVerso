/** S4 · Modelo tipado de un juego. Los campos son los mismos de datos-s3.js,
 * pero ahora TypeScript revisa que cada juego tenga la forma correcta. */
export interface Juego {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  /** null cuando el juego no tiene oferta. */
  precioOferta: number | null;
  stock: number;
  imagen: string;
  descripcion: string;
}

/** Categoría que se muestra en el inicio y en el menú. */
export interface Categoria {
  slug: string;
  nombre: string;
  descripcion: string;
  imagen: string;
}
