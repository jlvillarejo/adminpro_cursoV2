import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { Medico } from '../../../models/medico.model';

import { MedicoService } from '../../../services/medico.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { UtilsService } from '../../../services/utils.service';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public totalMedico: number = 0;
  public medicos: Medico[] = [];
  public medicosTemp: Medico[] = [];
  public desde: number = 0;
  public incremento: number = 5;
  public cargando: boolean = false;

  public imgSubs: Subscription;

  constructor(private medicoServ: MedicoService,
    private modalImagenServ: ModalImagenService,
    private utilsServ: UtilsService,
    private busqudasServ: BusquedasService) { }

  ngOnInit(): void {
    this.cargarMedicos();

    this.imgSubs = this.modalImagenServ.nuevaImagen.subscribe(img => this.cargarMedicos());

  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cambiarDesde(valor: number) {
    this.desde = this.desde + valor;

    this.cargarMedicos();
  }

  cargarMedicos() {
    this.cargando = true;

    this.medicoServ.obtenerMedicos(this.desde)
      .subscribe(resp => {

        // console.log(resp);
        this.totalMedico = resp.total;
        this.medicos = resp.medicos;
        this.medicosTemp = resp.medicos;
        this.cargando = false;
      });

  }

  abrirModal(medico: Medico) {
    // console.log(medico);
    const img = this.utilsServ.imagenUrl(medico.img, 'medicos');
    this.modalImagenServ.abrirModal('medicos', medico._id, img);
  }

  buscarMedicos(termino: string) {

    if (termino.length === 0) {
      this.medicos = this.medicosTemp;
      return;
    }

    this.cargando = true;

    this.busqudasServ.buscar('medicos', termino)
      .subscribe(resp => {
        this.medicos = resp;
      });

    this.cargando = false;
  }

  borrarMedico(medico: Medico) {

    Swal.fire({
      title: '¿Borrar médico?',
      text: `Está a punto de borrar ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Si, borrarlo!'
    }).then((result) => {
      if (result.value) {

        this.medicoServ.borrarMedico(medico._id)
          .subscribe(resp => {
            this.cargarMedicos();
            Swal.fire('Borrado', `El médico ${medico.nombre} se ha eliminado`, 'success');
          });
      };

    });

  }
}
