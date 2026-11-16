import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CatalogoService } from '../../services/catalogo.service';
import { PedidosService } from '../../services/pedidos.service';

/** S4 · Muestra el último pedido guardado. No hay cálculo de despacho. */
@Component({
  selector: 'app-confirmacion',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './confirmacion.component.html'
})
export class ConfirmacionComponent {
  readonly catalogo = inject(CatalogoService);
  readonly pedido = inject(PedidosService).ultimo();
}
