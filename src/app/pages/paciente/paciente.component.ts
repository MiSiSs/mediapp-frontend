import { PacienteService } from './../../_service/paciente.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Paciente } from 'src/app/_model/paciente';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css']
})
export class PacienteComponent implements OnInit {

  displayedColumns = ['idPaciente', 'nombres', 'apellidos','email','acciones'];
  dataSource: MatTableDataSource<Paciente>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  cantidad: number = 0;

  constructor(
    private pacienteService: PacienteService,
    private snackBar: MatSnackBar
    ) { }

  ngOnInit(): void {
    this.pacienteService.getPacienteCambio().subscribe(data =>{
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    this.pacienteService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {duration: 2000});
    });
    
    this.pacienteService.listarPageable(0, 10).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    })
    /*
    this.pacienteService.listar().subscribe(data =>{
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
    */
  }

  filtrar(valor: string){
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  eliminar(idPaciente: number) {
    this.pacienteService.eliminar(idPaciente).pipe(switchMap(() => {
      return this.pacienteService.listar()
    })).subscribe(data => {
      this.pacienteService.setPacienteCambio(data);
      this.pacienteService.setMensajecambio('SE ELIMINÓ');
    });
  }

  mostrarMas(e: any){
    this.pacienteService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    })
  }
}
