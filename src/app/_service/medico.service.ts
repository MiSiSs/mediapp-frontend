import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Medico } from './../_model/medico';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MedicoService extends GenericService<Medico>{

  private medicoCambio = new Subject<Medico[]>();
  private mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/medicos`      
    )
   }

  getMedicoCambio() {
    return this.medicoCambio.asObservable();
  }

  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }

  setMedicoCambio(medicos: Medico[]) {
    this.medicoCambio.next(medicos);
  }

  setMensajeCambio(mensaje: string) {
    this.mensajeCambio.next(mensaje);
  }
}
