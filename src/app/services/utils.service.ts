import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UtilsService {


  constructor() { }

  imagenUrl(img: string, tipo: 'usuarios' | 'medicos' | 'hospitales') {

    const baseImgURL = `${base_url}/upload/${tipo}/`;

    if (img) {
      if (img.includes('https')) {
        return img;
      } else {
        return `${baseImgURL}${img}`;
      }
    } else {
      return `${baseImgURL}sin_imagen`;
    }
  }

}
