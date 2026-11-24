import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { CatalogoService } from '../../services/catalogo.service';
import { PersonasService } from '../../services/personas.service';
import { SesionService } from '../../services/sesion.service';

/** S5 · Datos de pago con FORMULARIO REACTIVO. El medio de pago es obligatorio;
 * la dirección de despacho es opcional. El pago sigue siendo simulado. */
@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './carrito.component.html'
})
export class CarritoComponent implements OnInit {
  readonly carrito = inject(CarritoService);
  readonly catalogo = inject(CatalogoService);
  readonly sesion = inject(SesionService);
  private readonly fb = inject(FormBuilder);
  private readonly personas = inject(PersonasService);
  private readonly router = inject(Router);
  mensaje = '';

  readonly formulario = this.fb.nonNullable.group({
    despacho: [''],
    pago: ['Débito (simulado)', [Validators.required]]
  });

  ngOnInit(): void {
    this.formulario.patchValue({ despacho: this.personas.perfil(this.sesion.correo).direccion });
  }

  cambiar(id: number, delta: number): void { this.carrito.cambiar(id, delta); }
  quitar(id: number): void { this.carrito.quitar(id); }
  vaciar(): void { this.carrito.vaciar(); }

  pagar(): void {
    this.formulario.markAllAsTouched();
    if (this.formulario.invalid) { this.mensaje = 'Selecciona un medio de pago.'; return; }
    const { despacho, pago } = this.formulario.getRawValue();
    if (!this.carrito.confirmar(this.sesion.correo, despacho, pago)) {
      this.mensaje = 'El carrito está vacío.';
      return;
    }
    this.router.navigateByUrl('/confirmacion');
  }
}
