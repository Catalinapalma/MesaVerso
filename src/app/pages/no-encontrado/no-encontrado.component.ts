import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** S4 · Ruta comodín (**): cualquier dirección que no exista muestra esta página. */
@Component({
  selector: 'app-no-encontrado',
  standalone: true,
  imports: [RouterLink],
  template: `<section class="section shell"><h1>Página no encontrada</h1><a routerLink="/">Volver a la tienda</a></section>`
})
export class NoEncontradoComponent {}
