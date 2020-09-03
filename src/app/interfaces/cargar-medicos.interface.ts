import { Medico } from '../models/medico.model';

export interface CargarMedicos {
  total: number;
  hospitales: Medico[];
}
