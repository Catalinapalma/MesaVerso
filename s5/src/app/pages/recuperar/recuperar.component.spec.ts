import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RecuperarComponent } from './recuperar.component';

describe('Recuperar contraseña', () => {
  let fixture: ComponentFixture<RecuperarComponent>;
  let componente: RecuperarComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecuperarComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperarComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Prueba 1: Correo válido
  it('acepta un correo electrónico con formato válido', () => {
    const correo = componente.formulario.controls.correo;
    correo.setValue('catalina@palma.com');

    expect(correo.hasError('email')).toBeFalse();
    expect(correo.valid).toBeTrue();
  });

  // Prueba 2: Correo inválido
  it('rechaza un correo electrónico con formato inválido', () => {
    const correo = componente.formulario.controls.correo;
    correo.setValue('catalina.palma.com');

    expect(correo.hasError('email')).toBeTrue();
    expect(correo.valid).toBeFalse();
  });

  // Prueba 3: Envío del formulario
  it('muestra la confirmación al enviar un correo válido', () => {
    componente.formulario.controls.correo.setValue('ana@correo.cl');

    componente.enviar();
    fixture.detectChanges();

    expect(componente.enviado).toBeTrue();
    expect(fixture.nativeElement.querySelector('[role="status"]')).not.toBeNull();
  });

  // Prueba 4: Limpieza del formulario
  it('limpia el correo y oculta la confirmación al presionar Limpiar', () => {
    componente.formulario.controls.correo.setValue('ana@correo.cl');

    componente.enviar();
    fixture.detectChanges();

    const boton: HTMLButtonElement | null =
      fixture.nativeElement.querySelector('button[type="button"]');

    expect(boton).not.toBeNull();

    boton!.click();
    fixture.detectChanges();

    expect(componente.formulario.controls.correo.value).toBe('');
    expect(componente.enviado).toBeFalse();
    expect(fixture.nativeElement.querySelector('[role="status"]')).toBeNull();
  });
});