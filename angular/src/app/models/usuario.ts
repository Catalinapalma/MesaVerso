/** Datos SIMULADOS. Estas fichas no otorgan permisos reales: el navegador es manipulable. */

/** Sesión de prueba guardada en sessionStorage (dura lo que la pestaña). */
export interface SesionDemo {
  rol: 'cliente' | 'administrador';
  correo: string;
  nombre: string;
}

/** Cuenta pública de demostración (una por rol). */
export interface CuentaDemo extends SesionDemo {
  clave: string;
}

/** Ficha de cliente: datos de contacto y despacho. */
export interface Cliente {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
}

/** Ficha de usuario del sistema: quién es y qué rol tiene. */
export interface Usuario {
  id: number;
  nombre: string;
  usuario: string;
  correo: string;
  rol: 'cliente' | 'administrador';
}
