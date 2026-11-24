import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Juego } from '../../models/juego';
import { CatalogoService } from '../../services/catalogo.service';

/** S4 · Una sola tarjeta para los 12 juegos (en S3 había 12 bloques casi iguales).
 * @Input recibe el juego desde la página padre; @Output avisa cuando se presiona "Agregar". */
@Component({
  selector: 'app-juego-tarjeta',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './juego-tarjeta.component.html'
})
export class JuegoTarjetaComponent {
  @Input({ required: true }) juego!: Juego;
  @Output() agregarAlCarrito = new EventEmitter<number>();
  readonly catalogo = inject(CatalogoService);
}
