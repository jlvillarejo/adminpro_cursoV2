import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string, tipo: 'usuarios' | 'medicos' | 'hospitales'): string {
    return this.imagenUrl(img, tipo);
  }

  imagenUrl(img, tipo) {

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
