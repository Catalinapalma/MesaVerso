import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { JuegoTarjetaComponent } from '../../components/juego-tarjeta/juego-tarjeta.component';
import { Juego } from '../../models/juego';
import { CarritoService } from '../../services/carrito.service';
import { CatalogoService } from '../../services/catalogo.service';
import { SesionService } from '../../services/sesion.service';

/** S4 · Portada, con la misma estructura de la versión S3.
 * Los bloques se generan con *ngIf y *ngFor a partir de los datos del catálogo. */
@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink, JuegoTarjetaComponent],
  templateUrl: './inicio.component.html'
})
export class InicioComponent {
  readonly catalogo = inject(CatalogoService);
  readonly sesion = inject(SesionService);
  private readonly carrito = inject(CarritoService);
  private readonly router = inject(Router);

  /** Juego destacado de la portada (Catan, como en S3). */
  readonly destacado: Juego | undefined = this.catalogo.porId(1);
  /** Tres ofertas para la sección "Ofertas especiales". */
  readonly ofertas: Juego[] = this.catalogo.ofertas().slice(0, 3);

  /** Juego sugerido al presionar "Sugerir un juego" (null hasta presionar). */
  sugerencia: Juego | null = null;

  /** Elige al azar un juego con stock disponible. Math.random() sirve solo para la demo. */
  sugerir(): void {
    const disponibles = this.catalogo.todos().filter(j => j.stock > 0);
    this.sugerencia = disponibles.length
      ? disponibles[Math.floor(Math.random() * disponibles.length)]
      : null;
  }

  quitarSugerencia(): void { this.sugerencia = null; }

  /** Solo un cliente puede agregar al carrito; los demás van a ingresar. */
  agregar(id: number): void {
    if (!this.sesion.esCliente) { this.router.navigateByUrl('/login'); return; }
    this.carrito.agregar(id);
  }
}
