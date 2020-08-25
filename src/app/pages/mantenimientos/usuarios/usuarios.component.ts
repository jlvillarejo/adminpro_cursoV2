import { Component, OnInit, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';

import { Usuario } from 'src/app/models/usuario.model';

import { UsuarioService } from '../../../services/usuario.service';
import { BusquedasService } from '../../../services/busquedas.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsr: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public desde: number = 0;
  public incremento: number = 5;
  public cargando: boolean = false;

  public imgSubs: Subscription

  constructor(private usuarioServ: UsuarioService,
    private busqudasServ: BusquedasService,
    private modalImagenServ: ModalImagenService) { }

  ngOnInit(): void {
    this.cargarUsuarios();

    this.imgSubs = this.modalImagenServ.nuevaImagen.subscribe(img => this.cargarUsuarios());
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();

  }

  cambiarDesde(valor: number) {
    this.desde = this.desde + valor;

    this.cargarUsuarios();
  }

  cargarUsuarios() {

    this.cargando = true;

    this.usuarioServ.obtenerUsuarios(this.desde)
      .subscribe(({ total, usuarios }) => {
        this.totalUsr = total;
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;
        this.cargando = false;
        // console.log(this.usuarios);
      });

  }

  buscarUsrs(termino: string) {

    if (termino.length === 0) {
      this.usuarios = this.usuariosTemp;
      return;
    }

    this.cargando = true;

    this.busqudasServ.buscar('usuarios', termino)
      .subscribe(resp => {
        this.usuarios = resp;
      });

    this.cargando = false;

  }

  eliminarUsr(usuario: Usuario) {

    if (usuario.uid === this.usuarioServ.usuario.uid) {
      return Swal.fire('Atención', 'No puede eliminar su propio usuario', 'error');
    }

    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Está a punto de borrar a ${usuario.NomApe}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Si, borrarlo!'
    }).then((result) => {
      if (result.value) {

        this.usuarioServ.eliminarUsuario(usuario)
          .subscribe(resp => {

            this.cargarUsuarios();
            Swal.fire(
              '¡Borrado!',
              `El usuario ${usuario.nombre} ha sido borrado`,
              'success'
            );
          });
      };

    });

  }

  cambiarRol(usuario: Usuario) {

    this.usuarioServ.modificarUsr(usuario)
      .subscribe(resp => {
        console.log(resp);
      })

  }

  abrirModal(usr: Usuario) {

    this.modalImagenServ.abrirModal('usuarios', usr.uid, usr.imagenUrl);

  }

}
