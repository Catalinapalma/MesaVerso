import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { mensajeError, ofertaMenorQueNormal } from '../../validadores';
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
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
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

  private readonly fb = inject(FormBuilder);

  /** S5 · Formulario reactivo del producto nuevo. El precio de oferta es opcional,
   * pero si existe debe ser menor que el precio normal (validador de grupo). */
  readonly formulario = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    categoria: ['Estrategia', [Validators.required]],
    precio: [0, [Validators.required, Validators.min(1)]],
    precioOferta: [''],
    stock: [0, [Validators.required, Validators.min(0)]],
    imagen: ['img/catan.png', [Validators.required]],
    descripcion: ['', [Validators.required]]
  }, { validators: ofertaMenorQueNormal });

  mensajeDe(campo: string, etiqueta: string): string {
    return mensajeError(this.formulario.get(campo), etiqueta);
  }

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

  /** Evento Enviar del producto: valida y, si todo está bien, guarda el juego. */
  guardarJuego(): void {
    this.formulario.markAllAsTouched();
    if (this.formulario.invalid) {
      this.mensaje = 'Revisa los datos del juego: hay campos obligatorios o valores incorrectos.';
      return;
    }
    const v = this.formulario.getRawValue();
    const oferta = String(v.precioOferta).trim();
    this.catalogo.guardar({
      nombre: v.nombre,
      categoria: v.categoria,
      precio: Number(v.precio),
      precioOferta: oferta === '' ? null : Number(oferta),
      stock: Number(v.stock),
      imagen: v.imagen,
      descripcion: v.descripcion
    });
    this.mensaje = 'Juego guardado en la lista de demostración.';
    this.limpiarJuego();
    this.refrescar();
  }

  /** Evento Limpiar del formulario de producto. */
  limpiarJuego(): void {
    this.formulario.reset();
  }

  eliminarCliente(id: number): void { this.personas.eliminarCliente(id); this.refrescar(); }

  eliminarUsuario(id: number): void { this.personas.eliminarUsuario(id); this.refrescar(); }

  restablecer(): void {
    this.storage.restablecer();
    this.mensaje = 'Datos de demostración restablecidos.';
    this.refrescar();
  }
}
