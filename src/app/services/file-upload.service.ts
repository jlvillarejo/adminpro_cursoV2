import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor() { }

  async actualizarFoto(
    archivo: File,
    tipo: 'usuarios' | 'medicos' | 'hospitales',
    id: string
  ) {

    try {

      const url = `${base_url}/upload/${tipo}/${id}`;
      const formData = new FormData();

      formData.append('imagen', archivo);

      // petición
      const resp = await fetch(url, {
        method: 'PUT',
        headers: {
          'x-token': localStorage.getItem('token') || ''
        },
        body: formData
      });

      const data = await resp.json();
      // console.log(data);

      if (data.ok) {
        return data.nombreArchivo;
      } else {
        Swal.fire('Error', data.msg, 'error');
        console.log(data.msg);
        return false;
      }

    } catch (error) {
      Swal.fire('Error', 'Se ha producido un error en el servidor', 'error');
      console.log(error);
      return false;
    }

  }
}
