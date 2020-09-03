import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { CargarMedicos } from '../interfaces/cargar-medicos.interface';

import { Medico } from '../models/medico.model';
import { newMedico } from '../interfaces/new-medico.interface';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor(private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: { 'x-token': this.token } };
  }

  obtenerMedicos(desde: number = 0, bloque: number = 5) {

    //localhost:3015/api/hospitales/?desde=2&bloque=3
    const URL = `${base_url}/medicos?desde=${desde}&bloque=${bloque}`;
    return this.http.get<CargarMedicos>(URL, this.headers)
      .pipe(
        map((resp: any) => {
          return {
            total: resp.total,
            medicos: resp.medicos
          }
        }
        )
      );
  }

  getMedico(id: string) {
    const URL = `${base_url}/medicos/${id}`;
    return this.http.get(URL, this.headers)
      .pipe(
        map((resp: { ok: boolean, medico: Medico }) => resp.medico)
      );
  }

  crearMedico(medico: newMedico) {
    const URL = `${base_url}/medicos`;
    return this.http.post(URL, medico, this.headers);
  }

  actualizarMedico(medico: Medico) {

    const URL = `${base_url}/medicos/${medico._id}`;
    return this.http.put(URL, medico, this.headers);
  }

  borrarMedico(_id: string) {

    const URL = `${base_url}/medicos/${_id}`;
    return this.http.delete(URL, this.headers);
  }

}
