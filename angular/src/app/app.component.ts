import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EncabezadoComponent } from './components/encabezado/encabezado.component';

/** S4 · Componente raíz: la carcasa que queda fija mientras cambia la página.
 * El encabezado se escribe UNA vez aquí (en S3 estaba copiado en 15 HTML). */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, EncabezadoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {}
