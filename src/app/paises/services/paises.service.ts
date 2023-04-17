import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pais, PaisSmall } from '../interfaces/paises.interface';
import { Observable, combineLatest, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _baseUrl: string = 'https://restcountries.com/v3.1'
  private _continentes: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get continentes(): string[] {
    return [...this._continentes];
  }

  constructor(private http: HttpClient) { }

  getPaisesByContinente(continente: string): Observable<PaisSmall[]> {
    const url: string = `${this._baseUrl}/region/${continente}?fields=name,cca3`;

    return this.http.get<PaisSmall[]>(url)
  }

  getPaisByCode(code: string): Observable<Pais[] | []> {
    if (!code) {
      return of([]); //El "of" devuelve un Observable (en este caso un Observable con null)
    }

    const url: string = `${this._baseUrl}/alpha/${code}`;

    return this.http.get<Pais[]>(url);
  }

  getPaisSmallByCode(code: string): Observable<PaisSmall> {
    const url: string = `${this._baseUrl}/alpha/${code}?fields=name,cca3`;

    return this.http.get<PaisSmall>(url);
  }

  getPaisesSmallByCodes(codes: string[]): Observable<PaisSmall[] | []> {
    if (!codes) {
      return of([]);
    }

    const peticiones: Observable<PaisSmall>[] = [];

    codes.forEach(code => {
      const peticion = this.getPaisSmallByCode(code); //Para que se dispare un Observable tengo que llamar al ".suscribe", pero en este punto todavía no lo ejecuto
      peticiones.push(peticion);
    });

    //El "combineLatest" dispara todas las peticiones de Observable en forma simultánea (función de rxjs)
    return combineLatest(peticiones);
  }
}
