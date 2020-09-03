import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { Hospital } from 'src/app/models/hospital.model';

import { HospitalService } from '../../../services/hospital.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { UtilsService } from '../../../services/utils.service';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})

export class HospitalesComponent implements OnInit, OnDestroy {

  public totalHosp: number = 0;
  public hospitales: Hospital[] = [];
  public hospitalesTemp: Hospital[] = [];
  public desde: number = 0;
  public incremento: number = 5;
  public cargando: boolean = false;

  public imgSubs: Subscription;

  constructor(private hospitalServ: HospitalService,
    private modalImagenServ: ModalImagenService,
    private utilsServ: UtilsService,
    private busqudasServ: BusquedasService) { }

  ngOnInit(): void {
    this.cargarHospitales();

    this.imgSubs = this.modalImagenServ.nuevaImagen.subscribe(img => this.cargarHospitales());

  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cambiarDesde(valor: number) {
    this.desde = this.desde + valor;

    this.cargarHospitales();
  }

  cargarHospitales() {
    this.cargando = true;

    this.hospitalServ.obtenerHospitales(this.desde)
      .subscribe(resp => {

        // console.log(resp);
        this.totalHosp = resp.total;
        this.hospitales = resp.hospitales;
        this.hospitalesTemp = resp.hospitales;
        this.cargando = false;
      });

  }

  guardarCambios(hospital: Hospital) {

    // console.log(hospital);
    this.hospitalServ.modHospital(hospital._id, hospital.nombre)
      .subscribe(resp => {
        Swal.fire('Modificado', hospital.nombre, 'success');
      });
  }

  borrarHospital(hospital: Hospital) {

    Swal.fire({
      title: '¿Borrar hospital?',
      text: `Está a punto de borrar ${hospital.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Si, borrarlo!'
    }).then((result) => {
      if (result.value) {

        this.hospitalServ.borrarHospital(hospital._id)
          .subscribe(resp => {
            this.cargarHospitales();
            Swal.fire('Borrado', `El hospital ${hospital.nombre} se ha eliminado`, 'success');
          });
      };

    });

  }

  async crearHospital() {
    const { value } = await Swal.fire<string>({
      title: 'Nuevo hospital',
      text: 'Introduzca el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre de hospital',
      showCancelButton: true,
    });

    if (value.trim().length > 0) {
      this.hospitalServ.crearHospital(value)
        .subscribe((resp: any) => {
          // this.cargarHospitales();
          this.hospitales.push(resp.hospital);
          Swal.fire('Creado', `Se ha creado el hospital ${value}`, 'success');
        });
    } else {
      Swal.fire('Atención', `Debe introducir un nombre de hospital`, 'warning');
    }
  }

  abrirModal(hospital: Hospital) {
    console.log(hospital);
    const img = this.utilsServ.imagenUrl(hospital.img, 'hospitales');
    this.modalImagenServ.abrirModal('hospitales', hospital._id, img);
  }

  buscarHospitales(termino: string) {
    if (termino.length === 0) {
      this.hospitales = this.hospitalesTemp;
      return;
    }

    this.cargando = true;

    this.busqudasServ.buscar('hospitales', termino)
      .subscribe(resp => {
        this.hospitales = resp;
      });

    this.cargando = false;
  }
}
