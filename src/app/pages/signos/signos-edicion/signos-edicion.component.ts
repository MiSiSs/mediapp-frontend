import { SignosService } from './../../../_service/signos.service';
import { Signos } from './../../../_model/signos';
import { PacienteDialogComponent } from './paciente-dialog/paciente-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PacienteService } from './../../../_service/paciente.service';
import { Paciente } from 'src/app/_model/paciente';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-signos-edicion',
  templateUrl: './signos-edicion.component.html',
  styleUrls: ['./signos-edicion.component.css']
})
export class SignosEdicionComponent implements OnInit {

  form: FormGroup;
  pacienteSeleccionado: Paciente;
  myControlPaciente: FormControl = new FormControl();
  pacientesFiltrados$: Observable<Paciente[]>;
  pacientes: Paciente[] = [];

  fechaSeleccionada: Date = new Date();
  maxFecha: Date = new Date();
  id: number;

  signos: Signos;
  edicion: boolean = false;

  constructor(
    private pacienteService: PacienteService,
    private signosService: SignosService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
    ) { }

  ngOnInit(): void {

    this.signos = new Signos();

    this.form = new FormGroup({
      'id': new FormControl(0),
      'paciente': this.myControlPaciente,
      'fecha': new FormControl(new Date()),
      'temperatura': new FormControl(''),
      'pulso': new FormControl(''),
      'ritmo': new FormControl('')
    });
    this.listarPacientes();
    this.pacientesFiltrados$ = this.myControlPaciente.valueChanges.pipe(map(val => this.filtrarPacientes(val)));

    this.pacienteService.getPacienteCambio().subscribe(data => {
      this.listarPacientes();
      this.pacientesFiltrados$ = this.myControlPaciente.valueChanges.pipe(map(val => this.filtrarPacientes(val)));
    })

    this.pacienteService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {duration: 2000});
    })

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      console.log(this.id);
      this.edicion = data['id'] != null;
      this.initForm();
    });
  }

  initForm(){
    if(this.edicion){
      this.signosService.listarPorId(this.id).subscribe(data => {
        let id = data.idSigno;
        let paciente = data.paciente;
        let temperatura = data.temperatura;
        let pulso = data.pulso;
        let ritmo = data.ritmo;
        let fecha = data.fecha;

        this.myControlPaciente.setValue(paciente);

        this.form = new FormGroup({
          'id': new FormControl(id),
          'paciente': this.myControlPaciente,
          'temperatura': new FormControl(temperatura),
          'pulso': new FormControl(pulso),
          'ritmo': new FormControl(ritmo),
          'fecha': new FormControl(fecha)
        })
      })
    }
  }

  operar(){
    this.signos = new Signos();
    this.signos.idSigno = this.form.value['id'];
    this.signos.paciente = this.form.value['paciente'];
    this.signos.fecha = moment(this.form.value['fecha']).format('YYYY-MM-DDTHH:mm:ss');
    this.signos.temperatura = this.form.value['temperatura'];
    this.signos.pulso = this.form.value["pulso"];
    this.signos.ritmo = this.form.value["ritmo"];

    if(this.signos != null && this.signos.idSigno > 0){
      console.log("entro?");
      this.signosService.modificar(this.signos).pipe(switchMap(()=> {
        return this.signosService.listar();
      })).subscribe(data => {
        this.signosService.setSignosCambio(data);
        this.signosService.setMensajeCambio("Se modificó");
      });
    }else{
      this.signosService.registrar(this.signos).pipe(switchMap(()=>{
        return this.signosService.listar();
      })).subscribe(data => {
        this.signosService.setSignosCambio(data);
        this.signosService.setMensajeCambio("Se registró");
      })
    }
    console.log(this.signos);

    this.router.navigate(['signos']);
  }

  filtrarPacientes(val: any){
    if(val != null && val.idPaciente > 0){
      return this.pacientes.filter(el => 
        el.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || 
        el.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) ||
        el.dni.includes(val.dni)
      );
    }

    return this.pacientes.filter(el => 
      el.nombres.toLowerCase().includes(val?.toLowerCase()) || 
      el.apellidos.toLowerCase().includes(val?.toLowerCase()) || 
      el.dni.includes(val)
    );
  }

  listarPacientes(){
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }
  mostrarPaciente(val: Paciente){
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }

  seleccionarPaciente(e: any) {
    this.pacienteSeleccionado = e.option.value;
  }

  abrirDialogo(){
    this.dialog.open(PacienteDialogComponent, {
      width: '50%'
    })
  }

  limpiarControles(){
    this.pacienteSeleccionado = null;
    this.fechaSeleccionada = new Date();
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);
    this.myControlPaciente.reset();
  }
  
}
