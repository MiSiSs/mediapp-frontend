import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { Paciente } from '../_model/paciente';
import { environment } from './../../environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PacienteService extends GenericService<Paciente>{

  private pacienteCambio = new Subject<Paciente[]>();
  private mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) {
      super(
        http,
        `${environment.HOST}/pacientes`
      )
   }

  listarPageable(p: number, s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }
  
  getPacienteCambio(){
    return this.pacienteCambio.asObservable();
  }

  setPacienteCambio(pacientes: Paciente[]){
    this.pacienteCambio.next(pacientes);
  }
  
  getMensajeCambio(){
    return this.mensajeCambio.asObservable();
  }

  setMensajecambio(mensaje: string){
    return this.mensajeCambio.next(mensaje);
  }
}
