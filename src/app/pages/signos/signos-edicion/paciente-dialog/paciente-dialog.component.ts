import { MatDialogRef } from '@angular/material/dialog';
import { switchMap } from 'rxjs/operators';
import { Paciente } from 'src/app/_model/paciente';
import { PacienteService } from './../../../../_service/paciente.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-paciente-dialog',
  templateUrl: './paciente-dialog.component.html',
  styleUrls: ['./paciente-dialog.component.css']
})
export class PacienteDialogComponent implements OnInit {

  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<PacienteDialogComponent>,
    private pacienteService: PacienteService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'nombres': new FormControl(''),
      'apellidos': new FormControl(''),
      'dni': new FormControl(''),
      'telefono': new FormControl(''),
      'direccion': new FormControl('')
    });
  }

  aceptar(){
    let paciente = new Paciente();

    paciente.nombres = this.form.value['nombres'];
    paciente.apellidos = this.form.value['apellidos'];
    paciente.dni = this.form.value['dni'];
    paciente.telefono = this.form.value['telefono'];
    paciente.direccion = this.form.value['direccion'];

    this.pacienteService.registrar(paciente).pipe(switchMap(() => {
      return this.pacienteService.listar();
    })).subscribe(data=> {
      this.pacienteService.setPacienteCambio(data);
      this.pacienteService.setMensajecambio("Se ha registrado un nuevo paciente");
    });
    this.cerrar();
  }

  cerrar(){
    this.dialogRef.close();
  }
}
