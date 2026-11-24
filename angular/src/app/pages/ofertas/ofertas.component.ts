import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { JuegoTarjetaComponent } from '../../components/juego-tarjeta/juego-tarjeta.component';
import { CarritoService } from '../../services/carrito.service';
import { CatalogoService } from '../../services/catalogo.service';
import { SesionService } from '../../services/sesion.service';

/** S4 · Ofertas: reutiliza la misma tarjeta con los juegos que tienen precioOferta. */
@Component({
  selector: 'app-ofertas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, JuegoTarjetaComponent],
  templateUrl: './ofertas.component.html'
})
export class OfertasComponent {
  readonly catalogo = inject(CatalogoService);
  private readonly carrito = inject(CarritoService);
  private readonly sesion = inject(SesionService);
  private readonly router = inject(Router);
  aviso = '';
  busqueda = '';

  get visibles() {
    const termino = this.busqueda.trim().toLocaleLowerCase('es');
    return this.catalogo.ofertas()
      .filter(juego => juego.nombre.toLocaleLowerCase('es').includes(termino));
  }

  get totalOfertas(): number { return this.catalogo.ofertas().length; }

  agregar(id: number): void {
    if (!this.sesion.esCliente) { this.router.navigateByUrl('/login'); return; }
    this.aviso = this.carrito.agregar(id) ? 'Juego agregado al carrito de demostración.' : 'Sin stock disponible.';
  }
}
