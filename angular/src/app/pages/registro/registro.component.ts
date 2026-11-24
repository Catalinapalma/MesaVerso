import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PersonasService } from '../../services/personas.service';

/** S4 · Registro SIN validaciones (la pauta de S4 pide no incluir validaciones ni JS de formularios).
 * Solo enlaza los campos con [(ngModel)] y guarda una ficha de demostración. Nunca guarda contraseñas. */
@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro.component.html'
})
export class RegistroComponent {
  private readonly personas = inject(PersonasService);
  nombre = '';
  correo = '';
  telefono = '';
  direccion = '';
  mensaje = '';

  registrar(): void {
    this.personas.agregarCliente({ nombre: this.nombre, correo: this.correo, telefono: this.telefono, direccion: this.direccion });
    this.mensaje = 'Ficha creada en modo demostración. Para iniciar sesión usa una de las cuentas de prueba.';
  }
}
