import { switchMap } from 'rxjs/operators';
import { Paciente } from 'src/app/_model/paciente';
import { PacienteService } from './../../../_service/paciente.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-paciente-edicion',
  templateUrl: './paciente-edicion.component.html',
  styleUrls: ['./paciente-edicion.component.css']
})
export class PacienteEdicionComponent implements OnInit {

  form: FormGroup;
  id: number;
  edicion: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pacienteService: PacienteService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombres': new FormControl(''),
      'apellidos': new FormControl(""),
      'dni': new FormControl(""),
      'telefono': new FormControl(""),
      'direccion': new FormControl(""),
      'email': new FormControl("")
    });

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.initFrom();
    })
  }

  get f() { return this.form.controls; }

  private initFrom(){
    if(this.edicion){
      this.pacienteService.listarPorId(this.id).subscribe(data => {
        this.form = new FormGroup({
          'id': new FormControl(data.idPaciente),
          'nombres': new FormControl(data.nombres),
          'apellidos': new FormControl(data.apellidos),
          'dni': new FormControl(data.dni),
          'telefono': new FormControl(data.telefono),
          'direccion': new FormControl(data.direccion),
          'email': new FormControl(data.email)
        })
      })
    }
  }

  operar(){
    if (this.form.invalid) { return; }
    console.log("entro operar");
    let paciente = new Paciente();
    paciente.idPaciente = this.form.value['id'];
    paciente.nombres = this.form.value['nombres'];
    paciente.apellidos = this.form.value['apellidos'];
    paciente.dni = this.form.value['dni'];
    paciente.direccion = this.form.value['direccion'];
    paciente.email = this.form.value['email'];

    if(this.edicion){
      ///IDEAL
      console.log("Entro modificar");
      this.pacienteService.modificar(paciente).pipe(switchMap(()=> {
        return this.pacienteService.listar();
      })).subscribe(data => {
        this.pacienteService.setPacienteCambio(data);
        this.pacienteService.setMensajecambio("SE MODIFICO");
        console.log("Modifico");
      });
  
    }else{
      //COMUN
      console.log("Entro registrar");
      this.pacienteService.registrar(paciente).subscribe(() => {
        this.pacienteService.listar().subscribe(data => {
          this.pacienteService.setPacienteCambio(data);
          this.pacienteService.setMensajecambio("SE REGISTRÓ");
          console.log("Registro");
        });
      });
    }

    this.router.navigate(['paciente']);
  }
}
