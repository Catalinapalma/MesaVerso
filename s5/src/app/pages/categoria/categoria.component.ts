import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { JuegoTarjetaComponent } from '../../components/juego-tarjeta/juego-tarjeta.component';
import { Categoria, Juego } from '../../models/juego';
import { CarritoService } from '../../services/carrito.service';
import { CatalogoService } from '../../services/catalogo.service';
import { SesionService } from '../../services/sesion.service';

/** S4 · UNA sola página para las cuatro categorías: la URL /categoria/:slug entrega el slug.
 * paramMap avisa cada vez que cambia el slug, aunque el componente ya esté en pantalla. */
@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, JuegoTarjetaComponent],
  templateUrl: './categoria.component.html'
})
export class CategoriaComponent implements OnInit, OnDestroy {
  readonly catalogo = inject(CatalogoService);
  private readonly carrito = inject(CarritoService);
  private readonly sesion = inject(SesionService);
  private readonly router = inject(Router);
  private readonly ruta = inject(ActivatedRoute);
  private sub?: Subscription;

  categoria?: Categoria;
  /** Lo que escribe el usuario en el buscador (se enlaza con [(ngModel)]). */
  busqueda = '';
  aviso = '';

  ngOnInit(): void {
    this.sub = this.ruta.paramMap.subscribe(params => {
      this.categoria = this.catalogo.categoriaPorSlug(params.get('slug') || '');
      this.busqueda = '';
      this.aviso = '';
    });
  }

  ngOnDestroy(): void { this.sub?.unsubscribe(); }

  /** Juegos de la categoría filtrados por el texto del buscador. */
  get visibles(): Juego[] {
    if (!this.categoria) return [];
    const termino = this.busqueda.trim().toLocaleLowerCase('es');
    return this.catalogo.porCategoria(this.categoria.nombre)
      .filter(j => j.nombre.toLocaleLowerCase('es').includes(termino));
  }

  get totalCategoria(): number {
    return this.categoria ? this.catalogo.porCategoria(this.categoria.nombre).length : 0;
  }

  /** Solo un cliente puede agregar; los demás son enviados a iniciar sesión. */
  agregar(id: number): void {
    if (!this.sesion.esCliente) { this.router.navigateByUrl('/login'); return; }
    const juego = this.catalogo.porId(id);
    this.aviso = this.carrito.agregar(id)
      ? `${juego?.nombre} agregado al carrito de demostración.`
      : 'No fue posible agregar el juego (sin stock disponible).';
  }
}
