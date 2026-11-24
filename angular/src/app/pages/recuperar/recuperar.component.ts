import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

/** S4 · Recuperar contraseña: versión simplificada y demostrativa.
 * No envía correos; solo muestra un mensaje simulado. */
@Component({
  selector: 'app-recuperar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './recuperar.component.html'
})
export class RecuperarComponent {
  correo = '';
  enviado = false;

  enviar(): void { this.enviado = true; }
}
