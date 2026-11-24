import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { CategoriaComponent } from './pages/categoria/categoria.component';
import { CategoriasComponent } from './pages/categorias/categorias.component';
import { OfertasComponent } from './pages/ofertas/ofertas.component';
import { DetalleComponent } from './pages/detalle/detalle.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { RecuperarComponent } from './pages/recuperar/recuperar.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { ConfirmacionComponent } from './pages/confirmacion/confirmacion.component';
import { HistorialComponent } from './pages/historial/historial.component';
import { AdminComponent } from './pages/admin/admin.component';
import { NoEncontradoComponent } from './pages/no-encontrado/no-encontrado.component';

/** S4 · Un solo archivo de rutas. Las cuatro categorías usan la MISMA ruta con parámetro :slug,
 * y todos los juegos usan la MISMA ruta juego/:id. Así no existe un HTML por producto. */
export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'categoria/:slug', component: CategoriaComponent },
  { path: 'categorias', component: CategoriasComponent },
  { path: 'ofertas', component: OfertasComponent },
  { path: 'juego/:id', component: DetalleComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'recuperar', component: RecuperarComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'confirmacion', component: ConfirmacionComponent },
  { path: 'historial', component: HistorialComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', component: NoEncontradoComponent }
];
