import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent {

  public usuario: Usuario;

  // public NomApe: string = '';
  // public Nombre: String = '';

  constructor(private usuarioService: UsuarioService) {
    this.usuario = usuarioService.usuario;
    // this.NomApe = this.usuario.nombre + ' ' + this.usuario.apellidos.slice(0, this.usuario.apellidos.indexOf(' ')); // nombre + 1 apellido
    // this.Nombre = this.usuario.nombre;

    // console.log(this.Nombre);
  }

  logout() {
    this.usuarioService.logout();
  }

}
