import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment.prod';
import { CargarHospitales } from '../interfaces/cargar-hospitales.interface';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: { 'x-token': this.token } };
  }

  obtenerHospitales(desde: number = 0, bloque: number = 5) {

    //localhost:3015/api/hospitales/?desde=2&bloque=3
    const URL = `${base_url}/hospitales?desde=${desde}&bloque=${bloque}`;
    return this.http.get<CargarHospitales>(URL, this.headers)
      .pipe(
        map(resp => {
          return {
            total: resp.total,
            hospitales: resp.hospitales
          }
        }
        )
      );
  }

  getAllHospitales() {
    const URL = `${base_url}/hospitales/all`;
    return this.http.get<CargarHospitales>(URL, this.headers)
      .pipe(
        map(resp => {
          return {
            total: resp.total,
            hospitales: resp.hospitales
          }
        }
        )
      );
  }

  crearHospital(nombre: string) {

    const URL = `${base_url}/hospitales`;
    return this.http.post(URL, { nombre }, this.headers);

  }

  modHospital(_id: string, nombre: string) {

    const URL = `${base_url}/hospitales/${_id}`;
    return this.http.put(URL, { nombre }, this.headers);

  }

  borrarHospital(_id: string) {

    const URL = `${base_url}/hospitales/${_id}`;
    return this.http.delete(URL, this.headers);

  }

}
