import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RegistroComponent } from './registro.component';

// Jasmine: describe agrupa las pruebas del componente de registro (S5).
describe('Registro de usuario - Semana 5', () => {
  let fixture: ComponentFixture<RegistroComponent>;
  let componente: RegistroComponent;

  // Antes de cada prueba se crea el componente real, con su plantilla.
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroComponent],       // Es standalone: no va en declarations.
      providers: [provideRouter([])]      // routerLink necesita un enrutador.
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();              // Renderiza el HTML inicial.
  });

  it('rechaza un correo electrónico sin formato válido', () => {
    // ARRANGE: elegimos el control de correo.
    const correo = componente.formulario.controls.correo;

    // ACT: ingresamos un dato incorrecto sin usar el navegador.
    correo.setValue('correo-sin-arroba');

    // ASSERT: la regla de email responde y el formulario queda inválido.
    expect(correo.hasError('email')).toBeTrue();
    expect(correo.valid).toBeFalse();
  });

  it('rechaza contraseñas válidas por separado pero distintas entre sí', () => {
    // ARRANGE: seleccionamos los controles que validará el grupo.
    const { clave, repeticion } = componente.formulario.controls;

    // ACT: ambas cumplen las reglas propias, pero no coinciden.
    clave.setValue('Clave123');
    repeticion.setValue('Clave456');

    // ASSERT: la diferencia se informa como error del formulario.
    expect(componente.formulario.hasError('clavesDistintas')).toBeTrue();
    expect(componente.formulario.invalid).toBeTrue();
  });

  it('limpia los datos y el mensaje al presionar el botón Limpiar', () => {
    // ARRANGE: simulamos que la persona ya escribió un dato y que hay un mensaje visible.
    componente.formulario.controls.nombre.setValue('Ana Pérez');
    componente.mensaje = 'Mensaje anterior';
    fixture.detectChanges();

    // ACT: buscamos el botón real de la plantilla y hacemos clic.
    const boton: HTMLButtonElement | null =
      fixture.nativeElement.querySelector('[data-testid="btn-limpiar"]');
    expect(boton).not.toBeNull();
    boton!.click();
    fixture.detectChanges();

    // ASSERT: el valor del campo y el mensaje vuelven al estado inicial.
    expect(componente.formulario.controls.nombre.value).toBe('');
    expect(componente.mensaje).toBe('');
    expect(fixture.nativeElement.querySelector('[role="status"]')).toBeNull();
  });
});
