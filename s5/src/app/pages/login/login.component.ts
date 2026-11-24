import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CUENTAS_DEMO } from '../../data/datos-iniciales';
import { SesionService } from '../../services/sesion.service';
import { mensajeError } from '../../validadores';

/** S5 · Inicio de sesión con FORMULARIO REACTIVO. Ambos campos son obligatorios
 * y el correo debe tener formato válido. Solo acepta las dos cuentas de demostración. */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly sesion = inject(SesionService);
  private readonly router = inject(Router);
  readonly cuentas = CUENTAS_DEMO;

  mensaje = '';
  alerta = '';

  readonly formulario = this.fb.nonNullable.group({
    correo: ['', [Validators.required, Validators.email]],
    clave: ['', [Validators.required]]
  });

  mensajeDe(campo: string, etiqueta: string): string {
    return mensajeError(this.formulario.get(campo), etiqueta);
  }

  /** Botones "Usar esta cuenta": rellena el formulario con los datos de prueba. */
  usar(correo: string, clave: string): void {
    this.formulario.setValue({ correo, clave });
    this.mensaje = '';
    this.alerta = '';
  }

  /** Evento Enviar: primero valida; solo después comprueba la cuenta. */
  entrar(): void {
    this.formulario.markAllAsTouched();
    if (this.formulario.invalid) {
      this.alerta = 'Revisa los campos obligatorios antes de iniciar sesión.';
      return;
    }
    const { correo, clave } = this.formulario.getRawValue();
    if (!this.sesion.entrar(correo, clave)) {
      this.alerta = '';
      this.mensaje = 'Correo o contraseña no coinciden con una cuenta de prueba.';
      return;
    }
    // El administrador va al panel; el cliente, a la tienda.
    this.router.navigateByUrl(this.sesion.esAdmin ? '/admin' : '/');
  }

  /** Evento Limpiar: vacía los campos y los mensajes. */
  limpiar(): void {
    this.formulario.reset();
    this.mensaje = '';
    this.alerta = '';
  }
}
