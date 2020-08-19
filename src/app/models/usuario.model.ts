import { environment } from '../../environments/environment';

const baseImgURL = environment.base_url + '/upload/usuarios/';

export class Usuario {

  constructor(
    public nombre: string,
    public apellidos: string,
    public email: string,
    public password?: string,
    public img?: string,
    public google?: boolean,
    public rol?: string,
    public uid?: string,
  ) { }

  get imagenUrl() {
    if (this.img) {
      if (this.google) {
        return this.img;
      } else {
        return `${baseImgURL}${this.img}`
      }
    } else {
      return `${baseImgURL}sin_imagen`;
    }
  }

  get NomApe() {
    const na = this.nombre + ' ' + this.apellidos.slice(0, this.apellidos.indexOf(' '));
    return na;
  }

}

