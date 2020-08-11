
export class Usuario {

  constructor(
    public nombre: string,
    public apellidos: string,
    public email: string,
    public password?: string,
    public img?: string,
    public google?: boolean,
    public rol?: string,
    public uid?: string,
  ) { }


}

