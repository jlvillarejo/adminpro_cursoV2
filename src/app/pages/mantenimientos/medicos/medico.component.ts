import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { HospitalService } from '../../../services/hospital.service';
import { MedicoService } from '../../../services/medico.service';
import { UtilsService } from '../../../services/utils.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';

import { CargarHospitales } from 'src/app/interfaces/cargar-hospitales.interface';

import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from '../../../models/medico.model';



@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})

export class MedicoComponent implements OnInit, OnDestroy {

  public medicoForm: FormGroup;
  public hospitales: Hospital[] = [];
  public hospitalSel: Hospital = null;
  public medicoSel: Medico = null;

  public imgSubs: Subscription;

  constructor(private fb: FormBuilder,
    private hospitalServ: HospitalService,
    private medicoServ: MedicoService,
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    private utilsServ: UtilsService,
    private modalImagenServ: ModalImagenService) { }

  ngOnInit(): void {

    // Formulario definición
    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required]
    });

    this.medicoForm.get('hospital').valueChanges
      .subscribe(hospitalID => {
        this.hospitalSel = this.hospitales.find(h => h._id === hospitalID);

      });

    this.cargarHospitales();

    this.ActivatedRoute.params
      .subscribe(({ id }) => this.cargarMedico(id));

    this.imgSubs = this.modalImagenServ.nuevaImagen.subscribe(img => this.cargarMedico(this.medicoSel._id));

  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarMedico(id: string) {

    if (id !== 'nuevo') {
      this.medicoServ.getMedico(id)
        .subscribe((med: Medico) => {
          if (med) {
            const { nombre, hospital: { _id } } = med;
            this.medicoSel = med;
            this.medicoForm.setValue({ nombre, hospital: _id });
          } else {
            Swal.fire('Error', 'Se ha producido un error al recuperar el médico seleccionado.', 'error')
              .then((result) => this.router.navigateByUrl('/dashboard/medicos'));
          }
        });
    }
  }

  guardarMedico() {

    if (this.medicoSel) {
      // actualizar
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSel._id
      }

      this.medicoServ.actualizarMedico(data)
        .subscribe((resp: any) => {
          console.log(resp);
          Swal.fire('Modificado', `Se ha modificado el medico ${resp.medico.nombre}`, 'success');
        });
    } else {
      // crear
      this.medicoServ.crearMedico(this.medicoForm.value)
        .subscribe((resp: any) => {
          Swal.fire('Creado', `Se ha creado el medico ${resp.medico.nombre}`, 'success');
          this.router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`);
        });
    }
  }

  cargarHospitales() {

    this.hospitalServ.getAllHospitales()
      .subscribe((resp: CargarHospitales) => {
        this.hospitales = resp.hospitales;
      });
  }

  abrirModal(medico: Medico) {
    // console.log(medico);
    const img = this.utilsServ.imagenUrl(medico.img, 'medicos');
    this.modalImagenServ.abrirModal('medicos', medico._id, img);

  }
}
