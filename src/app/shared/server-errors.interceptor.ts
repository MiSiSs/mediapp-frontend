import { LoginService } from './../_service/login.service';
import { environment } from './../../environments/environment';
import { EMPTY, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import { catchError, retry, tap} from 'rxjs/operators'

@Injectable({
    providedIn: 'root'
})
export class ServerErrorsInterceptor implements HttpInterceptor{

    constructor(private snackBar: MatSnackBar, private router: Router
        , private loginService: LoginService){}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        return next.handle(request).pipe(retry(environment.REINTENTOS)).
            pipe(tap(event => {
                if(event instanceof HttpResponse){
                    if(event.body && event.body.error === true && event.body.errorMessage){
                        throw new Error(event.body.errorMensaje);
                    }
                }
            })).pipe(catchError((err) => {
                if(err.status === 400){
                    this.snackBar.open(err.error.mensaje, 'ERROR 400', { duration: 5000 });
                }
                else if(err.status === 404){
                    this.snackBar.open('No existe el recurso', 'ERROR 404', { duration: 5000 });
                }
                else if (err.status === 403) {
                    this.snackBar.open(err.error.error_description, 'ERROR 403', { duration: 5000 });
                }
                else if (err.status === 500) {
                    this.snackBar.open(err.error.mensaje, 'ERROR 500', { duration: 5000 });
                }else{
                    this.snackBar.open(err.error.mensaje, 'ERROR', { duration: 5000 });
                }
                return EMPTY;
            }));
    }
}