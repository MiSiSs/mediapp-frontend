import { Subject } from 'rxjs';
import { GenericService } from './generic.service';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Examen } from '../_model/examen';

@Injectable({
  providedIn: 'root'
})
export class ExamenService extends GenericService<Examen>{

private examenCambio = new Subject<Examen[]>();
private mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/examen`);
  }

   getExamenCambio() {
    return this.examenCambio.asObservable();
  }

  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }

  setExamenCambio(examenes: Examen[]) {
    this.examenCambio.next(examenes);
  }

  setMensajeCambio(mensaje: string) {
    this.mensajeCambio.next(mensaje);
  }
}
