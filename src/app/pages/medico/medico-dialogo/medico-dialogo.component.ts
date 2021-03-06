import { switchMap } from 'rxjs/operators';
import { MedicoService } from './../../../_service/medico.service';
import { Medico } from './../../../_model/medico';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-medico-dialogo',
  templateUrl: './medico-dialogo.component.html',
  styleUrls: ['./medico-dialogo.component.css']
})
export class MedicoDialogoComponent implements OnInit {

  medico: Medico;

  constructor(
    private medicoService: MedicoService,
    private dialogRef: MatDialogRef<MedicoDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Medico
  ) { }

  ngOnInit(): void {
    this.medico = new Medico();
    this.medico.idMedico = this.data.idMedico;
    this.medico.nombres = this.data.nombres;
    this.medico.apellidos = this.data.apellidos;
    this.medico.cmp = this.data.cmp;
    this.medico.fotoUrl = this.data.fotoUrl;
  }

  operar(){
    if(this.medico != null && this.medico.idMedico > 0){
      this.medicoService.modificar(this.medico).pipe(switchMap(() => {
        return this.medicoService.listar();
      })).subscribe(data => {
        this.medicoService.setMedicoCambio(data);
        this.medicoService.setMensajeCambio("SE MODIFICO");
      });
    }else{
      this.medicoService.registrar(this.medico).pipe(switchMap(()=>{
        return this.medicoService.listar();
      })).subscribe(data =>{
        this.medicoService.setMedicoCambio(data);
        this.medicoService.setMensajeCambio("SE REGISTRO");
      });
    }
    this.cerrar();
  }

  cerrar(){
    this.dialogRef.close();
  }
}
