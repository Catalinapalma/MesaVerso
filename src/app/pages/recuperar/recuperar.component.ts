import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { mensajeError } from '../../validadores';

/** S5 · Recuperar contraseña con FORMULARIO REACTIVO: correo obligatorio y con formato válido.
 * Es una simulación: no envía correos. */
@Component({
  selector: 'app-recuperar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './recuperar.component.html'
})
export class RecuperarComponent {
  private readonly fb = inject(FormBuilder);
  enviado = false;

  readonly formulario = this.fb.nonNullable.group({
    correo: ['', [Validators.required, Validators.email]]
  });

  mensajeDe(campo: string, etiqueta: string): string {
    return mensajeError(this.formulario.get(campo), etiqueta);
  }

  enviar(): void {
    this.formulario.markAllAsTouched();
    this.enviado = this.formulario.valid;
  }

  limpiar(): void {
    this.formulario.reset();
    this.enviado = false;
  }
}
