import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { PaisSmall } from '../../interfaces/paises.interface';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    continente: ['', [Validators.required]],
    pais: ['', [Validators.required]],
    frontera: ['', [Validators.required]]
    //frontera: [{value: '', disabled: true}] //Una forma de deshabilitar un elemento del formulario
  });

  //Llenar selectores
  continentes: string[] = [];
  paises: PaisSmall[] = [];
  //fronteras: string[] = []; --Antes de la clase 266 "Cambiar codigos de fronteras por los nombres de los paises"
  fronteras: PaisSmall[] = [];

  //UI
  cargando: boolean = false;

  constructor(private fb: FormBuilder,
              private paisesService: PaisesService) { }

  ngOnInit(): void {
    this.continentes = this.paisesService.continentes;

    //Cuando cambia el continente
    // this.miFormulario.get('continente')?.valueChanges
    //   .subscribe(continente => {
    //     console.log(continente);
    //     this.paisesService.getPaisesByContinente(continente)
    //       .subscribe(paises => {
    //         this.paises = paises;
    //         console.log(paises);
    //       });
    //   });
    ////////////////////////////////////////////////////////////////
    //Otra forma de hacer lo anterior un poco más limpia con rxjs
    this.miFormulario.get('continente')?.valueChanges
      .pipe( //Ayuda a transformar el valor que venga en el Observable
        tap((_) => { //El "tap" dispara un efecto secundario al recibir el Observable...blanqueo una variable en particular
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
        }), 
        switchMap(continente => { //El switchMap redirecciona a otro Observable que va a ser el final que se va a mostrar (paises)
          return this.paisesService.getPaisesByContinente(continente)
        })
      )
      .subscribe(paises => {
        this.paises = paises;
        this.cargando = false;
      });

    //Cuando cambia el país
    this.miFormulario.get('pais')?.valueChanges
      .pipe( //Ayuda a transformar el valor que venga en el Observable
        tap((_) => { //El "tap" dispara un efecto secundario al recibir el Observable...blanqueo una variable en particular
          this.fronteras = [];
          this.miFormulario.get('frontera')?.reset('');
          this.cargando = true;
        }), 
        switchMap(codigo => { //El switchMap redirecciona a otro Observable que va a ser el final que se va a mostrar (paises)
          return this.paisesService.getPaisByCode(codigo);
        }),
        switchMap(pais => {
          return this.paisesService.getPaisesSmallByCodes(pais[0]?.borders);
        })
      )
      .subscribe(paises => {
        this.fronteras = paises;
        this.cargando = false;
      });
  }

  guardar() {
    console.log(this.miFormulario.value);
  }
}
