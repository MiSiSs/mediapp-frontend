import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from './_service/login.service';
import { Menu } from './_model/menu';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'mediapp-frontend';
  @ViewChild(MatAccordion) accordion: MatAccordion;
  menus: Menu[];
  perfil: boolean = false;

  constructor(
    public loginService: LoginService
  ){}

  ngOnInit(){
    this.perfil = false;
    this.loginService.getMenuCambio().subscribe(data => {
      this.menus = data;
    })
  }
}
