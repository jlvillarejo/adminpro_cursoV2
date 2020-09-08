import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BusquedasService } from '../../services/busquedas.service';

import { Usuario } from '../../models/usuario.model';
import { Medico } from '../../models/medico.model';
import { Hospital } from '../../models/hospital.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [
  ]
})

export class BusquedaComponent implements OnInit {

  public usuarios: Usuario[] = [];
  public medicos: Medico[] = [];
  public hospitales: Hospital[] = [];

  constructor( private activatedRoute: ActivatedRoute,
               private busquedasServ: BusquedasService,
               private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.params
        .subscribe( ({ termino }) => this.busquedaGlobal( termino ));
  }

  busquedaGlobal( txt: string) {
    this.busquedasServ.busquedaGlobal(txt)
        .subscribe( (resp: any) => {
          this.usuarios = resp.usuarios.map(
              user => new Usuario(user.nombre, user.apellidos, user.email, '', user.img, user.google, user.rol, user.uid)
            );
          this.medicos    = resp.medicos;
          this.hospitales = resp.hospitales;
        })
  }

  abrirMedico( medico: Medico) {

    this.router.navigateByUrl(`/dashboard/medico/${medico._id}`);

  }

}
