import { switchMap } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExamenService } from './../../_service/examen.service';
import { Examen } from './../../_model/examen';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-examen',
  templateUrl: './examen.component.html',
  styleUrls: ['./examen.component.css']
})
export class ExamenComponent implements OnInit {

  displayedColumns = ['id','nombre','descripcion','acciones'];
  dataSource: MatTableDataSource<Examen>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private examenService: ExamenService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.examenService.getExamenCambio().subscribe(data =>{
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.examenService.getMensajeCambio().subscribe(data=>{
      this.snackBar.open(data, 'AVISO',{
        duration: 2000
      });
    })

    this.examenService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  filtrar(valor: string){
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  eliminar(examen: Examen){
    this.examenService.eliminar(examen.idExamen).pipe(switchMap(()=>{
      return this.examenService.listar();
    })).subscribe(data => {
      this.examenService.setExamenCambio(data);
      this.examenService.setMensajeCambio("SE ELIMINÓ");      
    });
  }
}
