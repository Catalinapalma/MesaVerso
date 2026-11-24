import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CUENTAS_DEMO } from '../../data/datos-iniciales';
import { SesionService } from '../../services/sesion.service';

/** S4 · Inicio de sesión con las DOS cuentas de demostración.
 * [(ngModel)] enlaza cada campo con una variable; no se leen inputs con el DOM. */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private readonly sesion = inject(SesionService);
  private readonly router = inject(Router);
  readonly cuentas = CUENTAS_DEMO;
  correo = '';
  clave = '';
  mensaje = '';

  /** Rellena los campos con una cuenta de prueba (botones "Usar cuenta"). */
  usar(correo: string, clave: string): void {
    this.correo = correo;
    this.clave = clave;
  }

  entrar(): void {
    if (!this.sesion.entrar(this.correo, this.clave)) {
      this.mensaje = 'Correo o contraseña no coinciden con una cuenta de prueba.';
      return;
    }
    // El administrador va al panel; el cliente, a la tienda.
    this.router.navigateByUrl(this.sesion.esAdmin ? '/admin' : '/');
  }
}
