import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PersonasService } from '../../services/personas.service';
import { clavesCoinciden, edadMinima13, mensajeError } from '../../validadores';

/** S5 · Registro con FORMULARIO REACTIVO (FormGroup + FormBuilder).
 * Reglas: campos obligatorios, correo válido, clave de 6 a 18 con mayúscula y número,
 * claves iguales, edad mínima de 13 años. La dirección es opcional.
 * La contraseña NO se guarda: la cuenta de acceso sigue siendo una de las de demostración. */
@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.component.html'
})
export class RegistroComponent {
  private readonly fb = inject(FormBuilder);
  private readonly personas = inject(PersonasService);

  mensaje = '';
  alerta = '';

  /** nonNullable: al limpiar, cada campo vuelve a ser texto vacío y no null. */
  readonly formulario = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    correo: ['', [Validators.required, Validators.email]],
    clave: ['', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(18),
      // Al menos una mayúscula (incluidas vocales acentuadas y Ñ) y un dígito.
      Validators.pattern(/^(?=.*[A-ZÁÉÍÓÚÜÑ])(?=.*[0-9]).+$/)
    ]],
    repeticion: ['', [Validators.required]],
    nacimiento: ['', [Validators.required, edadMinima13]],
    telefono: [''],
    direccion: ['']
  }, { validators: clavesCoinciden });

  /** Mensaje del campo indicado (vacío si no hay error que mostrar). */
  mensajeDe(campo: string, etiqueta: string): string {
    return mensajeError(this.formulario.get(campo), etiqueta);
  }

  /** Solo se muestra cuando la repetición ya fue escrita y no coincide. */
  get clavesDistintas(): boolean {
    return this.formulario.hasError('clavesDistintas') && this.formulario.controls.repeticion.touched;
  }

  /** Evento Enviar: marca todo como tocado para mostrar los errores de una vez. */
  enviar(): void {
    this.formulario.markAllAsTouched();
    if (this.formulario.invalid) {
      this.mensaje = '';
      this.alerta = 'Hay datos incorrectos. Revisa los mensajes en rojo antes de continuar.';
      return;
    }
    const datos = this.formulario.getRawValue();
    this.personas.agregarCliente({
      nombre: datos.nombre, correo: datos.correo, telefono: datos.telefono, direccion: datos.direccion
    });
    this.alerta = '';
    this.mensaje = `Registro válido para ${datos.nombre}. Ficha creada en modo demostración (la clave no se guarda).`;
  }

  /** Evento Limpiar: devuelve todos los campos y mensajes a su estado inicial. */
  limpiar(): void {
    this.formulario.reset();
    this.mensaje = '';
    this.alerta = '';
  }
}
