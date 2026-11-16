import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PersonasService } from '../../services/personas.service';
import { SesionService } from '../../services/sesion.service';

/** S4 · Modificación de perfil simplificada: nombre, teléfono y dirección.
 * Los datos se cargan en ngOnInit y se guardan con [(ngModel)]. */
@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {
  readonly sesion = inject(SesionService);
  private readonly personas = inject(PersonasService);
  nombre = '';
  telefono = '';
  direccion = '';
  mensaje = '';

  ngOnInit(): void {
    const datos = this.personas.perfil(this.sesion.correo);
    this.nombre = datos.nombre;
    this.telefono = datos.telefono;
    this.direccion = datos.direccion;
  }

  guardar(): void {
    this.personas.guardarPerfil(this.sesion.correo, { nombre: this.nombre, telefono: this.telefono, direccion: this.direccion });
    this.sesion.cambiarNombre(this.nombre);
    this.mensaje = 'Perfil actualizado (simulado).';
  }
}
