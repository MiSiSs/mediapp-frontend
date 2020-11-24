import { switchMap } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Signos } from './../../_model/signos';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { SignosService } from './../../_service/signos.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-signos',
  templateUrl: './signos.component.html',
  styleUrls: ['./signos.component.css']
})
export class SignosComponent implements OnInit {

  displayedColumns = ['id', 'paciente','fecha', 'temperatura', 'pulso','ritmo','acciones'];
  dataSource: MatTableDataSource<Signos>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  cantidad: number = 0;

  constructor(
    private signoService: SignosService,
    private snackBar: MatSnackBar,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.signoService.getSignosCambio().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    this.signoService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {duration: 2000});
    });

    this.signoService.listarPageable(0,10).subscribe(data =>{
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });
  }

  filtrar(valor: string){
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  mostrarMas(e: any){
    this.signoService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    })
  }

  eliminar(signos: Signos){
    this.signoService.eliminar(signos.idSigno).pipe(switchMap(()=> {
      return this.signoService.listar();
    })).subscribe(data =>{
      this.signoService.setSignosCambio(data);
      this.signoService.setMensajeCambio('SE ELIMINO');
    });
  }
}
