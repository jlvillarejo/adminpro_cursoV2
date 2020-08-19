import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { UsuarioService } from '../../services/usuario.service';
import { FileUploadService } from '../../services/file-upload.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [
  ]
})
export class ProfileComponent implements OnInit {

  public perfilForm: FormGroup;
  public usuario: Usuario;
  public imagenSubir: File;
  public imgTemp: any = null;

  constructor(private fb: FormBuilder,
    private usuarioServ: UsuarioService,
    private fileUploadServ: FileUploadService) {

    this.usuario = usuarioServ.usuario;
  }

  ngOnInit(): void {

    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required],
      apellidos: [this.usuario.apellidos, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email]]
    })
  }

  actualizarPerfil() {
    // console.log(this.perfilForm.value);
    this.usuarioServ.actualizarPerfil(this.perfilForm.value)
      .subscribe((resp: any) => {
        const { nombre, apellidos, email } = this.perfilForm.value;

        // console.log(resp);
        this.usuario.nombre = nombre;
        this.usuario.apellidos = apellidos;
        this.usuario.email = email;

        Swal.fire('Usuario actualizado', this.usuario.nombre, 'success');

      }, (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      });

  }

  CambiarImagen(fichero: File) {
    this.imagenSubir = fichero;

    if (!fichero) {
      this.imgTemp = null;
      return;
    }

    const reader = new FileReader();
    const url64 = reader.readAsDataURL(fichero);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
  }

  subirImagen() {
    this.fileUploadServ.actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid)
      .then(img => {
        this.usuario.img = img;
        Swal.fire('Imagen actualizada', this.usuario.nombre, 'success');
      });
  }

}
