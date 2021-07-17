import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ProdutoComponent } from './pages/produto/produto.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ProdutoCadComponent } from './pages/produto-cad/produto-cad.component';
import { NgxMaskModule } from 'ngx-mask';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { ClienteCadComponent } from './pages/cliente-cad/cliente-cad.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './helper/jwt.interceptor';
import { AuthenticationService } from './services/authentication.service';
import { ApiService } from './services/api.service';
import { ConfigService } from './services/config.service';
import { BarsService } from './services/bars.service';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    ProdutoComponent,
    ProdutoCadComponent,
    ClienteComponent,
    ClienteCadComponent,
    UsuarioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot({
      dropSpecialCharacters: false // ao salvar, vai manter a mascara
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    AuthenticationService,
    ApiService,
    ConfigService,
    BarsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
