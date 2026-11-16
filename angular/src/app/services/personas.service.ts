import { Injectable, inject } from '@angular/core';
import { CLIENTES_INICIALES, USUARIOS_INICIALES } from '../data/datos-iniciales';
import { Cliente, Usuario } from '../models/usuario';
import { StorageService } from './storage.service';

/** S4 · Clientes, usuarios y perfil. Reemplaza perfil-s3.js y los mantenedores del admin. */
@Injectable({ providedIn: 'root' })
export class PersonasService {
  private readonly storage = inject(StorageService);

  clientes(): Cliente[] { return this.storage.leer<Cliente[]>('clientes', CLIENTES_INICIALES); }
  usuarios(): Usuario[] { return this.storage.leer<Usuario[]>('usuarios', USUARIOS_INICIALES); }

  /** Datos del perfil de un correo: primero busca en clientes, luego en usuarios. */
  perfil(correo: string): { nombre: string; telefono: string; direccion: string } {
    const cliente = this.clientes().find(c => c.correo === correo);
    if (cliente) return { nombre: cliente.nombre, telefono: cliente.telefono, direccion: cliente.direccion };
    const usuario = this.usuarios().find(u => u.correo === correo);
    return { nombre: usuario?.nombre ?? '', telefono: '', direccion: '' };
  }

  /** Actualiza el perfil. findIndex() busca la ficha; si no existe, la crea. */
  guardarPerfil(correo: string, datos: { nombre: string; telefono: string; direccion: string }): void {
    const lista = this.clientes();
    const posicion = lista.findIndex(c => c.correo === correo);
    if (posicion >= 0) {
      lista[posicion] = { ...lista[posicion], ...datos };
    } else {
      lista.push({ id: Math.max(0, ...lista.map(c => c.id)) + 1, correo, ...datos });
    }
    this.storage.guardar('clientes', lista);
  }

  /** Crea un cliente nuevo (ficha de cliente + ficha de usuario). */
  agregarCliente(datos: Omit<Cliente, 'id'>): void {
    const lista = this.clientes();
    this.storage.guardar('clientes', [...lista, { ...datos, id: Math.max(0, ...lista.map(c => c.id)) + 1 }]);
    const usuarios = this.usuarios();
    this.storage.guardar('usuarios', [...usuarios, {
      id: Math.max(0, ...usuarios.map(u => u.id)) + 1,
      nombre: datos.nombre, usuario: datos.correo.split('@')[0], correo: datos.correo, rol: 'cliente'
    }]);
  }

  eliminarCliente(id: number): void {
    this.storage.guardar('clientes', this.clientes().filter(c => c.id !== id));
  }

  eliminarUsuario(id: number): void {
    // Protección de demo: el administrador no puede eliminarse a sí mismo.
    this.storage.guardar('usuarios', this.usuarios().filter(u => u.rol === 'administrador' || u.id !== id));
  }
}
