import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Juego } from '../../models/juego';
import { Cliente, Usuario } from '../../models/usuario';
import { Pedido } from '../../models/pedido';
import { CatalogoService } from '../../services/catalogo.service';
import { PedidosService } from '../../services/pedidos.service';
import { PersonasService } from '../../services/personas.service';
import { SesionService } from '../../services/sesion.service';
import { StorageService } from '../../services/storage.service';

/** S4 · Panel del administrador con pestañas. Cada pestaña es un bloque *ngIf;
 * cada tabla es un *ngFor. Los mantenedores de S3 (crear, editar, eliminar) se conservan. */
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {
  readonly catalogo = inject(CatalogoService);
  readonly sesion = inject(SesionService);
  private readonly personas = inject(PersonasService);
  private readonly pedidosSrv = inject(PedidosService);
  private readonly storage = inject(StorageService);

  vista: 'productos' | 'clientes' | 'usuarios' | 'pedidos' = 'productos';
  productos: Juego[] = [];
  clientes: Cliente[] = [];
  usuarios: Usuario[] = [];
  pedidos: Pedido[] = [];
  mensaje = '';

  /** Formulario del producto nuevo (enlazado con [(ngModel)]). precioOferta usa '' cuando no hay oferta. */
  nuevo = { nombre: '', categoria: 'Estrategia', precio: 0, precioOferta: '', stock: 0, imagen: 'img/catan.png', descripcion: '' };

  ngOnInit(): void { this.refrescar(); }

  refrescar(): void {
    this.productos = this.catalogo.todos();
    this.clientes = this.personas.clientes();
    this.usuarios = this.personas.usuarios();
    this.pedidos = this.pedidosSrv.todos();
  }

  cambiarVista(v: 'productos' | 'clientes' | 'usuarios' | 'pedidos'): void { this.vista = v; this.mensaje = ''; }

  stock(juego: Juego, delta: number): void { this.catalogo.ajustarStock(juego.id, delta); this.refrescar(); }

  eliminarJuego(id: number): void { this.catalogo.eliminar(id); this.refrescar(); }

  guardarJuego(): void {
    const oferta = String(this.nuevo.precioOferta).trim();
    this.catalogo.guardar({
      nombre: this.nuevo.nombre,
      categoria: this.nuevo.categoria,
      precio: Number(this.nuevo.precio),
      precioOferta: oferta === '' ? null : Number(oferta),
      stock: Number(this.nuevo.stock),
      imagen: this.nuevo.imagen,
      descripcion: this.nuevo.descripcion
    });
    this.mensaje = 'Juego guardado en la lista de demostración.';
    this.nuevo = { nombre: '', categoria: 'Estrategia', precio: 0, precioOferta: '', stock: 0, imagen: 'img/catan.png', descripcion: '' };
    this.refrescar();
  }

  eliminarCliente(id: number): void { this.personas.eliminarCliente(id); this.refrescar(); }

  eliminarUsuario(id: number): void { this.personas.eliminarUsuario(id); this.refrescar(); }

  restablecer(): void {
    this.storage.restablecer();
    this.mensaje = 'Datos de demostración restablecidos.';
    this.refrescar();
  }
}
