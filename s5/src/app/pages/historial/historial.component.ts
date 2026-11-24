import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pedido } from '../../models/pedido';
import { CatalogoService } from '../../services/catalogo.service';
import { PedidosService } from '../../services/pedidos.service';
import { SesionService } from '../../services/sesion.service';

/** S4 · Historial del cliente: filter() y sort() viven en PedidosService. */
@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial.component.html'
})
export class HistorialComponent implements OnInit {
  readonly catalogo = inject(CatalogoService);
  readonly sesion = inject(SesionService);
  private readonly pedidos = inject(PedidosService);
  compras: Pedido[] = [];

  ngOnInit(): void {
    this.compras = this.pedidos.porCorreo(this.sesion.correo);
  }

  /** reduce() suma el total de todas las compras del cliente. */
  get totalGastado(): number {
    return this.compras.reduce((suma, p) => suma + p.total, 0);
  }

  get totalJuegos(): number {
    return this.compras.reduce((suma, pedido) =>
      suma + pedido.items.reduce((cantidad, item) => cantidad + item.cantidad, 0), 0);
  }
}
