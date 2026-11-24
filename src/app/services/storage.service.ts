import { Injectable } from '@angular/core';

/** S4 · Reemplaza las funciones leer() y guardar() de js/datos-s3.js.
 * Guarda SOLO datos ficticios bajo el prefijo mv_s4_ (para reconocerlos en F12). */
@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly prefijo = 'mv_s4_';

  /** Lee una clave. Si no existe o está dañada, devuelve una copia de los datos iniciales. */
  leer<T>(clave: string, inicial: T): T {
    try {
      const texto = localStorage.getItem(this.prefijo + clave);
      if (texto === null) return structuredClone(inicial);
      const valor: unknown = JSON.parse(texto);
      // Una lista no puede reemplazarse por otro tipo de dato.
      if (Array.isArray(inicial) && !Array.isArray(valor)) return structuredClone(inicial);
      return valor as T;
    } catch {
      return structuredClone(inicial);
    }
  }

  /** Convierte el valor a JSON y lo guarda en este navegador. */
  guardar<T>(clave: string, valor: T): void {
    localStorage.setItem(this.prefijo + clave, JSON.stringify(valor));
  }

  /** Borra todos los cambios de demostración (no usa localStorage.clear(), que borraría datos ajenos). */
  restablecer(): void {
    ['productos', 'carrito', 'pedidos', 'clientes', 'usuarios', 'ultimoPedido']
      .forEach(clave => localStorage.removeItem(this.prefijo + clave));
  }
}
