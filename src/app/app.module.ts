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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { UsuarioCadComponent } from './pages/usuario-cad/usuario-cad.component';
import { VendaComponent } from './pages/venda/venda.component';
import { VendaCadComponent } from './pages/venda-cad/venda-cad.component';
import { AuthGuardService } from './guards/auth-guard.service';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { BadRequestComponent } from './pages/errors/bad-request/bad-request.component';
import { UnauthorizedComponent } from './pages/errors/unauthorized/unauthorized.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { VendaDetalheComponent } from './modals/venda-detalhe/venda-detalhe.component';
import { EstoqueComponent } from './pages/estoque/estoque.component';
import { TrocaSenhaComponent } from './modals/troca-senha/troca-senha.component';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EstoqueCadComponent } from './pages/estoque-cad/estoque-cad.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { VendaRelComponent } from './pages/venda-rel/venda-rel.component';

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
    UsuarioComponent,
    UsuarioCadComponent,
    VendaComponent,
    VendaCadComponent,
    NotFoundComponent,
    BadRequestComponent,
    UnauthorizedComponent,
    VendaDetalheComponent,
    EstoqueComponent,
    TrocaSenhaComponent,
    EstoqueCadComponent,
    PerfilComponent,
    VendaRelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxMaskModule.forRoot({
      dropSpecialCharacters: false // ao salvar, vai manter a mascara
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    AuthenticationService,
    ApiService,
    ConfigService,
    BarsService,
    AuthGuardService,
    NgbActiveModal
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
