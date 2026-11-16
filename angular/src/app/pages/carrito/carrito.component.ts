import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { CatalogoService } from '../../services/catalogo.service';
import { PersonasService } from '../../services/personas.service';
import { SesionService } from '../../services/sesion.service';

/** S4 · Carrito con cantidades, total y pago SIMULADO (sin cálculo de despacho).
 * Las líneas salen de CarritoService y se dibujan con *ngFor. */
@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './carrito.component.html'
})
export class CarritoComponent implements OnInit {
  readonly carrito = inject(CarritoService);
  readonly catalogo = inject(CatalogoService);
  readonly sesion = inject(SesionService);
  private readonly personas = inject(PersonasService);
  private readonly router = inject(Router);

  despacho = '';
  pago = 'Débito (simulado)';
  mensaje = '';

  ngOnInit(): void {
    this.despacho = this.personas.perfil(this.sesion.correo).direccion;
  }

  cambiar(id: number, delta: number): void { this.carrito.cambiar(id, delta); }
  quitar(id: number): void { this.carrito.quitar(id); }
  vaciar(): void { this.carrito.vaciar(); }

  pagar(): void {
    if (!this.carrito.confirmar(this.sesion.correo, this.despacho, this.pago)) {
      this.mensaje = 'El carrito está vacío.';
      return;
    }
    this.router.navigateByUrl('/confirmacion');
  }
}
