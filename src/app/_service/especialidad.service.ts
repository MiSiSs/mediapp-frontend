import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Especialidad } from './../_model/especialidad';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService extends GenericService<Especialidad>{
  private especialidadCambio = new Subject<Especialidad[]>();
  private mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/especialidades`
    )
   }
  getEspecialidadCambio(){
    return this.especialidadCambio.asObservable();
  }

  setEspecialidadCambio(especialidades: Especialidad[]){
    this.especialidadCambio.next(especialidades);
  }

  getMensajeCambio(){
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje: string){
    return this.mensajeCambio.next(mensaje);
  }
}
