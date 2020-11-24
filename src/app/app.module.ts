import { ServerErrorsInterceptor } from './shared/server-errors.interceptor';
import { environment } from './../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EspecialidadComponent } from './pages/especialidad/especialidad.component';
import { MedicoComponent } from './pages/medico/medico.component';
import { PacienteComponent } from './pages/paciente/paciente.component';
import { MedicoDialogoComponent } from './pages/medico/medico-dialogo/medico-dialogo.component';
import { ConsultaComponent } from './pages/consulta/consulta.component';
import { ConsultaEspecialComponent } from './pages/consulta-especial/consulta-especial.component';
import { ExamenComponent } from './pages/examen/examen.component';
import { BuscarComponent } from './pages/buscar/buscar.component';
import { ReporteComponent } from './pages/reporte/reporte.component';
import { PacienteEdicionComponent } from './pages/paciente/paciente-edicion/paciente-edicion.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './material/material.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { EspecialidadEdicionComponent } from './pages/especialidad/especialidad-edicion/especialidad-edicion.component';
import { ExamenEdicionComponent } from './pages/examen/examen-edicion/examen-edicion.component';
import { WizardComponent } from './pages/consulta/wizard/wizard.component';
import { BuscarDialogoComponent } from './pages/buscar/buscar-dialogo/buscar-dialogo.component';
import { LoginComponent } from './pages/login/login.component';
import { JwtModule } from '@auth0/angular-jwt';
import { Not403Component } from './pages/not403/not403.component';
import { Not404Component } from './pages/not404/not404.component';
import { BienvenidoComponent } from './pages/bienvenido/bienvenido.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { SignosComponent } from './pages/signos/signos.component';
import { SignosEdicionComponent } from './pages/signos/signos-edicion/signos-edicion.component';
import { RecuperarComponent } from './pages/login/recuperar/recuperar.component';
import { TokenComponent } from './pages/login/recuperar/token/token.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PacienteDialogComponent } from './pages/signos/signos-edicion/paciente-dialog/paciente-dialog.component';

export function tokenGetter() {
  return sessionStorage.getItem(environment.TOKEN_NAME);
}

@NgModule({
  declarations: [
    AppComponent,
    EspecialidadComponent,
    MedicoComponent,
    PacienteComponent,
    MedicoDialogoComponent,
    ConsultaComponent,
    ConsultaEspecialComponent,
    ExamenComponent,
    BuscarComponent,
    ReporteComponent,
    PacienteEdicionComponent,
    EspecialidadEdicionComponent,
    ExamenEdicionComponent,
    WizardComponent,
    BuscarDialogoComponent,
    LoginComponent,
    Not403Component,
    Not404Component,
    BienvenidoComponent,
    PerfilComponent,
    SignosComponent,
    SignosEdicionComponent,
    PacienteDialogComponent,
    RecuperarComponent,
    TokenComponent,
    PacienteDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    PdfViewerModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: [environment.HOST.substring(7)],
        disallowedRoutes: [`http://${environment.HOST.substring(7)}/login/enviarCorreo`],
      }
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorsInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
