import { Injectable, inject } from '@angular/core';
import { CATEGORIAS, JUEGOS_INICIALES } from '../data/datos-iniciales';
import { Categoria, Juego } from '../models/juego';
import { StorageService } from './storage.service';

/** S4 · Entrega los juegos a las páginas. Reemplaza los <article> repetidos del HTML.
 * Entrada: pedidos desde las vistas; proceso: lectura/escritura local; salida: objetos Juego. */
@Injectable({ providedIn: 'root' })
export class CatalogoService {
  private readonly storage = inject(StorageService);
  readonly categorias: Categoria[] = CATEGORIAS;

  /** Todos los juegos (los datos iniciales o los cambios guardados por el admin). */
  todos(): Juego[] { return this.storage.leer<Juego[]>('productos', JUEGOS_INICIALES); }

  porId(id: number): Juego | undefined { return this.todos().find(j => j.id === id); }

  porCategoria(nombre: string): Juego[] { return this.todos().filter(j => j.categoria === nombre); }

  /** Solo los juegos que tienen precio de oferta. */
  ofertas(): Juego[] { return this.todos().filter(j => j.precioOferta !== null); }

  categoriaPorSlug(slug: string): Categoria | undefined { return this.categorias.find(c => c.slug === slug); }

  /** Precio que realmente paga el cliente: la oferta si existe, o el precio normal. */
  precioFinal(juego: Juego): number { return juego.precioOferta ?? juego.precio; }

  /** Porcentaje de descuento redondeado (ej.: 34.990 -> 27.992 = 20). 0 si no hay oferta. */
  descuentoPorcentaje(juego: Juego): number {
    return juego.precioOferta === null ? 0 : Math.round((1 - juego.precioOferta / juego.precio) * 100);
  }

  /** Suma (o resta, con delta negativo) unidades al stock de un juego. */
  ajustarStock(id: number, delta: number): void {
    const datos = this.todos().map(j => j.id === id ? { ...j, stock: Math.max(0, j.stock + delta) } : j);
    this.storage.guardar('productos', datos);
  }

  /** Crea un juego nuevo (id automático) o reemplaza uno existente con el mismo id. */
  guardar(juego: Omit<Juego, 'id'> & { id?: number }): void {
    const datos = this.todos();
    const posicion = datos.findIndex(j => j.id === juego.id);
    const nuevoId = Math.max(0, ...datos.map(j => j.id)) + 1;
    const registro: Juego = { ...juego, id: posicion >= 0 ? datos[posicion].id : nuevoId };
    if (posicion >= 0) datos[posicion] = registro;
    else datos.push(registro);
    this.storage.guardar('productos', datos);
  }

  eliminar(id: number): void {
    this.storage.guardar('productos', this.todos().filter(j => j.id !== id));
  }

  /** Formato de pesos chilenos: $34.990 */
  moneda(valor: number): string {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(valor);
  }
}
