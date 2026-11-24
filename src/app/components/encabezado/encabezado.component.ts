import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { CatalogoService } from '../../services/catalogo.service';
import { SesionService } from '../../services/sesion.service';

/** S4 · Menú único. Las opciones cambian según el rol con *ngIf
 * (antes se hacía con atributos data-rol y el script sesion-s3.js). */
@Component({
  selector: 'app-encabezado',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './encabezado.component.html'
})
export class EncabezadoComponent {
  readonly sesion = inject(SesionService);
  readonly carrito = inject(CarritoService);
  readonly catalogo = inject(CatalogoService);
  private readonly router = inject(Router);
  menuAbierto = false;

  /** Cierra el menú móvil después de elegir una opción. */
  cerrarMenu(): void { this.menuAbierto = false; }

  salir(): void {
    this.sesion.salir();
    this.cerrarMenu();
    this.router.navigateByUrl('/');
  }
}
