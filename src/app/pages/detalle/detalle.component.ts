import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Juego } from '../../models/juego';
import { CarritoService } from '../../services/carrito.service';
import { CatalogoService } from '../../services/catalogo.service';
import { SesionService } from '../../services/sesion.service';

/** S4 · UNA ficha para todos los juegos. La URL /juego/:id entrega el ID;
 * el servicio busca el juego y la vista lo muestra. En S3 existía una página por producto. */
@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle.component.html'
})
export class DetalleComponent implements OnInit, OnDestroy {
  readonly catalogo = inject(CatalogoService);
  private readonly ruta = inject(ActivatedRoute);
  private readonly carrito = inject(CarritoService);
  private readonly sesion = inject(SesionService);
  private readonly router = inject(Router);
  private sub?: Subscription;

  juego?: Juego;
  mensaje = '';

  ngOnInit(): void {
    this.sub = this.ruta.paramMap.subscribe(params => {
      this.juego = this.catalogo.porId(Number(params.get('id')));
      this.mensaje = '';
    });
  }

  ngOnDestroy(): void { this.sub?.unsubscribe(); }

  /** Slug de la categoría del juego, para el enlace "Volver a…". */
  slugCategoria(nombre: string): string {
    return this.catalogo.categorias.find(c => c.nombre === nombre)?.slug || '';
  }

  agregar(): void {
    if (!this.juego) return;
    if (!this.sesion.esCliente) { this.router.navigateByUrl('/login'); return; }
    this.mensaje = this.carrito.agregar(this.juego.id)
      ? 'Juego agregado al carrito de demostración.'
      : 'Juego no disponible (sin stock).';
  }
}
