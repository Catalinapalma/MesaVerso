import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** S5 · Validadores propios. Reglas separadas de la plantilla, como en el ejemplo del docente.
 * Los campos vacíos los reporta Validators.required; aquí solo se comparan valores completos. */

/** Grupo: la clave y su repetición deben ser iguales. */
export const clavesCoinciden: ValidatorFn = (grupo: AbstractControl): ValidationErrors | null => {
  const clave = grupo.get('clave')?.value as string | undefined;
  const repeticion = grupo.get('repeticion')?.value as string | undefined;
  if (!clave || !repeticion) return null;
  return clave === repeticion ? null : { clavesDistintas: true };
};

/** Fecha real (AAAA-MM-DD), no futura y con 13 años cumplidos.
 * Se comparan año, mes y día para evitar problemas de zona horaria. */
export const edadMinima13: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const valor = String(control.value ?? '').trim();
  if (!valor) return null;

  const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor);
  if (!partes) return { fechaInvalida: true };

  const anio = Number(partes[1]);
  const mes = Number(partes[2]);
  const dia = Number(partes[3]);
  const fecha = new Date(anio, mes - 1, dia);
  // new Date ajusta fechas imposibles (por ejemplo, 31 de febrero).
  if (fecha.getFullYear() !== anio || fecha.getMonth() !== mes - 1 || fecha.getDate() !== dia) {
    return { fechaInvalida: true };
  }

  const hoy = new Date();
  const ahora = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  if (fecha > ahora) return { fechaFutura: true };

  let edad = ahora.getFullYear() - anio;
  const aunNoCumple = ahora.getMonth() < mes - 1 ||
    (ahora.getMonth() === mes - 1 && ahora.getDate() < dia);
  if (aunNoCumple) edad -= 1;

  return edad >= 13 ? null : { edadMinima: true };
};

/** Grupo de producto: si hay precio de oferta, debe ser menor que el precio normal. */
export const ofertaMenorQueNormal: ValidatorFn = (grupo: AbstractControl): ValidationErrors | null => {
  const precio = Number(grupo.get('precio')?.value);
  const oferta = grupo.get('precioOferta')?.value;
  if (oferta === '' || oferta === null || oferta === undefined) return null;
  if (Number.isNaN(precio)) return null;
  return Number(oferta) < precio ? null : { ofertaInvalida: true };
};

/** Convierte el error de un control en un mensaje para la persona.
 * Solo muestra mensajes si el campo fue tocado o modificado. */
export function mensajeError(control: AbstractControl | null, etiqueta: string): string {
  if (!control || control.valid || !(control.touched || control.dirty)) return '';
  const e = control.errors ?? {};
  if (e['required']) return `${etiqueta} es obligatorio.`;
  if (e['email']) return 'Escribe un correo válido, por ejemplo nombre@correo.cl.';
  if (e['minlength']) return `${etiqueta} debe tener al menos ${e['minlength'].requiredLength} caracteres.`;
  if (e['maxlength']) return `${etiqueta} no puede tener más de ${e['maxlength'].requiredLength} caracteres.`;
  if (e['pattern']) return `${etiqueta} debe incluir al menos una mayúscula y un número.`;
  if (e['edadMinima']) return 'Debes tener al menos 13 años para registrarte.';
  if (e['fechaFutura']) return 'La fecha de nacimiento no puede ser futura.';
  if (e['fechaInvalida']) return 'Ingresa una fecha válida.';
  if (e['min']) return `${etiqueta} debe ser mayor o igual a ${e['min'].min}.`;
  return `${etiqueta} tiene un dato incorrecto.`;
}
