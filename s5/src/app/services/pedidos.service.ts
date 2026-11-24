import { Injectable, inject } from '@angular/core';
import { PEDIDOS_INICIALES } from '../data/datos-iniciales';
import { Pedido } from '../models/pedido';
import { StorageService } from './storage.service';

/** S4 · Pedidos simulados. Reemplaza historial-s3.js y confirmacion-s3.js.
 * Usa filter() para mostrar solo los pedidos del cliente que inició sesión. */
@Injectable({ providedIn: 'root' })
export class PedidosService {
  private readonly storage = inject(StorageService);

  todos(): Pedido[] { return this.storage.leer<Pedido[]>('pedidos', PEDIDOS_INICIALES); }

  /** Pedidos de un correo, del más nuevo al más antiguo. */
  porCorreo(correo: string): Pedido[] {
    return this.todos()
      .filter(p => p.correo === correo)
      .sort((a, b) => b.id - a.id);
  }

  /** Agrega un pedido con el siguiente ID y lo deja como "último pedido" para la confirmación. */
  agregar(datos: Omit<Pedido, 'id'>): Pedido {
    const lista = this.todos();
    const id = Math.max(0, ...lista.map(p => p.id)) + 1;
    const pedido: Pedido = { ...datos, id };
    this.storage.guardar('pedidos', [...lista, pedido]);
    this.storage.guardar('ultimoPedido', pedido);
    return pedido;
  }

  ultimo(): Pedido | null { return this.storage.leer<Pedido | null>('ultimoPedido', null); }
}
