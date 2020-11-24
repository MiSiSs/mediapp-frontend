import { switchMap } from 'rxjs/operators';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { EspecialidadService } from './../../../_service/especialidad.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Especialidad } from './../../../_model/especialidad';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-especialidad-edicion',
  templateUrl: './especialidad-edicion.component.html',
  styleUrls: ['./especialidad-edicion.component.css']
})
export class EspecialidadEdicionComponent implements OnInit {

  id: number;
  especialidad: Especialidad;
  form: FormGroup;
  edicion: boolean = false;

  constructor(
    private especialidadService: EspecialidadService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.especialidad = new Especialidad();

    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombre': new FormControl(''),
      'descripcion': new FormControl('')
    });

    this.route.params.subscribe((params: Params)=> {
      this.id = params['id'];
      this.edicion = params['id'] != null;
      this.initForm();
    })
  }

  initForm(){
    if(this.edicion){
      this.especialidadService.listarPorId(this.id).subscribe(data => {
        let id = data.idEspecialidad;
        let nombre = data.nombre;
        let descripcion = data.descripcion;
        this.form = new FormGroup({
          'id': new FormControl(id),
          'nombre': new FormControl(nombre),
          'descripcion': new FormControl(descripcion)
        })
      })
    }
  }
  operar(){
    this.especialidad.idEspecialidad = this.form.value['id'];
    this.especialidad.nombre = this.form.value['nombre'];
    this.especialidad.descripcion = this.form.value['descripcion'];

    if(this.especialidad.idEspecialidad != null && this.especialidad.idEspecialidad > 0){
      this.especialidadService.modificar(this.especialidad).pipe(switchMap(()=>{
        return this.especialidadService.listar();
      })).subscribe(data => {
        this.especialidadService.setEspecialidadCambio(data);
        this.especialidadService.setMensajeCambio("SE MODIFICÓ");
      });
    }else{
      this.especialidadService.registrar(this.especialidad).pipe(switchMap(()=>{
        return this.especialidadService.listar();
      })).subscribe(data => {
        this.especialidadService.setEspecialidadCambio(data);
        this.especialidadService.setMensajeCambio("SE REGISTRÓ");
      });
    }
    this.router.navigate(['especialidad']);
  }
}
