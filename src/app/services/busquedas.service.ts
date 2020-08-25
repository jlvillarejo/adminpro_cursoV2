import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor(private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: { 'x-token': this.token } };
  }

  private transfUser(resultados: any[]): Usuario[] {

    return resultados.map(
      user => new Usuario(user.nombre, user.apellidos, user.email, '', user.img, user.google, user.rol, user.uid)
    );

  }

  buscar(coleccion: 'usuarios' | 'medicos' | 'hospitales',
    termino: string = '') {

    const URL = `${base_url}/todo/coleccion/${coleccion}/${termino}`;
    return this.http.get<any[]>(URL, this.headers)
      .pipe(
        map((resp: any) => {

          switch (coleccion) {
            case 'usuarios':
              return this.transfUser(resp.resultados);
              break;

            default:
              return [];
          }
        })
      )
  }

}
