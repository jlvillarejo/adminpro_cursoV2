import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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

  constructor(private usuarioService: UsuarioService,
              private router: Router) {
    this.usuario = usuarioService.usuario;
  }

  logout() {
    this.usuarioService.logout();
  }

  buscar(txt: string) {

    if ( txt.length === 0) {

      Swal.fire('Aviso', 'No se ha introducido ningún termino de búsqueda', 'warning');
      return;
    }

    this.router.navigateByUrl(`/dashboard/buscar/${txt}`);
  }
}
