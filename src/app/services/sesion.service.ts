import { Injectable } from '@angular/core';
import { CUENTAS_DEMO } from '../data/datos-iniciales';
import { SesionDemo } from '../models/usuario';

/** S4 · Sesión de PRUEBA guardada en sessionStorage (igual que S3).
 * Es simulada: el navegador es manipulable, no es seguridad real. */
@Injectable({ providedIn: 'root' })
export class SesionService {
  private readonly prefijo = 'mv_s4_';

  get rol(): string { return sessionStorage.getItem(this.prefijo + 'rol') || ''; }
  get correo(): string { return sessionStorage.getItem(this.prefijo + 'correo') || ''; }
  get nombre(): string { return sessionStorage.getItem(this.prefijo + 'nombre') || ''; }
  get activa(): boolean { return Boolean(this.rol); }
  get esCliente(): boolean { return this.rol === 'cliente'; }
  get esAdmin(): boolean { return this.rol === 'administrador'; }

  /** Busca la cuenta de demostración; si coincide, inicia la sesión. */
  entrar(correo: string, clave: string): boolean {
    const cuenta = CUENTAS_DEMO.find(c => c.correo === correo.trim().toLowerCase() && c.clave === clave);
    if (!cuenta) return false;
    this.iniciar({ rol: cuenta.rol, correo: cuenta.correo, nombre: cuenta.nombre });
    return true;
  }

  iniciar(usuario: SesionDemo): void {
    sessionStorage.setItem(this.prefijo + 'rol', usuario.rol);
    sessionStorage.setItem(this.prefijo + 'correo', usuario.correo);
    sessionStorage.setItem(this.prefijo + 'nombre', usuario.nombre);
  }

  /** Cambia el nombre que se muestra en el menú (se usa al editar el perfil). */
  cambiarNombre(nombre: string): void { sessionStorage.setItem(this.prefijo + 'nombre', nombre); }

  salir(): void { ['rol', 'correo', 'nombre'].forEach(k => sessionStorage.removeItem(this.prefijo + k)); }
}
