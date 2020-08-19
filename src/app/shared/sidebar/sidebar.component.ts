import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public usuario: Usuario;

  // public NomApe: string = '';

  constructor(private sidebarService: SidebarService,
    private usuarioService: UsuarioService) {

    this.usuario = usuarioService.usuario;
    // this.NomApe = this.usuario.nombre + ' ' + this.usuario.apellidos.slice(0, this.usuario.apellidos.indexOf(' '));

    this.menuItems = sidebarService.menu;
    // console.log(this.menuItems)
  }

  ngOnInit(): void {
  }

}
