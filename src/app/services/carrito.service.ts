import { Injectable, inject } from '@angular/core';
import { CatalogoService } from './catalogo.service';
import { PedidosService } from './pedidos.service';
import { StorageService } from './storage.service';
import { Juego } from '../models/juego';
import { ItemCarrito } from '../models/pedido';

/** S4 · Migra carrito-s3.js. Ya no se pintan filas con createElement():
 * el servicio calcula las líneas y la página las dibuja con *ngFor. */
@Injectable({ providedIn: 'root' })
export class CarritoService {
  private readonly storage = inject(StorageService);
  private readonly catalogo = inject(CatalogoService);
  private readonly pedidos = inject(PedidosService);

  items(): ItemCarrito[] { return this.storage.leer<ItemCarrito[]>('carrito', []); }

  /** Unidades totales (para el contador del menú). reduce() suma las cantidades. */
  get cantidad(): number { return this.items().reduce((suma, i) => suma + i.cantidad, 0); }

  /** Líneas listas para mostrar: juego, cantidad y subtotal. */
  lineas(): { juego: Juego; cantidad: number; subtotal: number }[] {
    return this.items()
      .map(item => {
        const juego = this.catalogo.porId(item.id);
        return juego ? { juego, cantidad: item.cantidad, subtotal: this.catalogo.precioFinal(juego) * item.cantidad } : null;
      })
      .filter((linea): linea is { juego: Juego; cantidad: number; subtotal: number } => linea !== null);
  }

  total(): number { return this.lineas().reduce((suma, l) => suma + l.subtotal, 0); }

  /** Agrega una unidad respetando el stock. Devuelve false si no se pudo. */
  agregar(id: number): boolean {
    const juego = this.catalogo.porId(id);
    if (!juego || juego.stock <= 0) return false;
    const lista = this.items();
    const existente = lista.find(i => i.id === id);
    if (existente) {
      if (existente.cantidad >= juego.stock) return false;
      existente.cantidad += 1;
    } else {
      lista.push({ id, cantidad: 1 });
    }
    this.storage.guardar('carrito', lista);
    return true;
  }

  /** Cambia la cantidad (+1 o -1). Si llega a cero, el juego sale del carrito. */
  cambiar(id: number, delta: number): void {
    const juego = this.catalogo.porId(id);
    const lista = this.items()
      .map(i => i.id === id ? { ...i, cantidad: Math.min(i.cantidad + delta, juego?.stock ?? 0) } : i)
      .filter(i => i.cantidad > 0);
    this.storage.guardar('carrito', lista);
  }

  quitar(id: number): void { this.storage.guardar('carrito', this.items().filter(i => i.id !== id)); }

  vaciar(): void { this.storage.guardar('carrito', [] as ItemCarrito[]); }

  /** Simula el pago: crea el pedido, descuenta stock y vacía el carrito. */
  confirmar(correo: string, despacho: string, pago: string): boolean {
    const lineas = this.lineas();
    if (!lineas.length) return false;
    this.pedidos.agregar({
      correo,
      cliente: correo,
      items: lineas.map(l => ({ id: l.juego.id, nombre: l.juego.nombre, cantidad: l.cantidad, precio: this.catalogo.precioFinal(l.juego) })),
      total: this.total(),
      fecha: new Date().toISOString().slice(0, 10),
      estado: 'Pagado (simulado)',
      despacho,
      pago
    });
    lineas.forEach(l => this.catalogo.ajustarStock(l.juego.id, -l.cantidad));
    this.vaciar();
    return true;
  }
}
