import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PersonasService } from '../../services/personas.service';
import { SesionService } from '../../services/sesion.service';
import { mensajeError } from '../../validadores';

/** S5 · Perfil con FORMULARIO REACTIVO. El nombre es obligatorio;
 * teléfono y dirección de despacho son opcionales. */
@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {
  readonly sesion = inject(SesionService);
  private readonly fb = inject(FormBuilder);
  private readonly personas = inject(PersonasService);
  mensaje = '';

  readonly formulario = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    telefono: [''],
    direccion: ['']
  });

  ngOnInit(): void {
    // patchValue carga los datos guardados en el formulario al entrar.
    this.formulario.patchValue(this.personas.perfil(this.sesion.correo));
  }

  mensajeDe(campo: string, etiqueta: string): string {
    return mensajeError(this.formulario.get(campo), etiqueta);
  }

  guardar(): void {
    this.formulario.markAllAsTouched();
    if (this.formulario.invalid) { this.mensaje = ''; return; }
    const datos = this.formulario.getRawValue();
    this.personas.guardarPerfil(this.sesion.correo, datos);
    this.sesion.cambiarNombre(datos.nombre);
    this.mensaje = 'Perfil actualizado (simulado).';
  }

  limpiar(): void {
    this.formulario.reset();
    this.mensaje = '';
  }
}
