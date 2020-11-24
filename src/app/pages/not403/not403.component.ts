import { environment } from './../../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-not403',
  templateUrl: './not403.component.html',
  styleUrls: ['./not403.component.css']
})
export class Not403Component implements OnInit {

  usuario: string;

  constructor() { }

  ngOnInit(): void {
    const helper = new JwtHelperService();
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    const decodedToken = helper.decodeToken(token);
    this.usuario = decodedToken.user_name;
  }
//1;47:28
}
