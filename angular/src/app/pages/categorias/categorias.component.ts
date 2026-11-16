import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CatalogoService } from '../../services/catalogo.service';

/** S4 · Página "Categorías" del menú (equivale a categorias.html de S3).
 * Muestra las cuatro categorías con *ngFor; cada una lleva a la misma ruta /categoria/:slug. */
@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './categorias.component.html'
})
export class CategoriasComponent {
  readonly catalogo = inject(CatalogoService);
}
