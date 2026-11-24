/** Una línea de un pedido. */
export interface ItemPedido {
  id: number;
  nombre: string;
  cantidad: number;
  precio: number;
}

/** Pedido simulado: nunca se cobra dinero real. */
export interface Pedido {
  id: number;
  correo: string;
  cliente: string;
  items: ItemPedido[];
  total: number;
  fecha: string;
  estado: string;
  despacho: string;
  pago: string;
}

/** Elemento del carrito: solo guarda el ID del juego y la cantidad. */
export interface ItemCarrito {
  id: number;
  cantidad: number;
}
