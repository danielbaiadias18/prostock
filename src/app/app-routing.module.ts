import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './guards/auth-guard.service';
import { HomeComponent } from './home/home.component';
import { ClienteCadComponent } from './pages/cliente-cad/cliente-cad.component';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { BadRequestComponent } from './pages/errors/bad-request/bad-request.component';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { UnauthorizedComponent } from './pages/errors/unauthorized/unauthorized.component';
import { LoginComponent } from './pages/login/login.component';
import { ProdutoCadComponent } from './pages/produto-cad/produto-cad.component';
import { ProdutoComponent } from './pages/produto/produto.component';
import { UsuarioCadComponent } from './pages/usuario-cad/usuario-cad.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';

const routerOptions: ExtraOptions = {
  useHash: false,
  anchorScrolling: 'enabled',
  // ...any other options you'd like to use
};

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuardService] },
  { path: 'produto' , component: ProdutoComponent, canActivate: [AuthGuardService] },
  { path: 'produto/:id' , component: ProdutoCadComponent, canActivate: [AuthGuardService] },
  { path: 'cliente' , component: ClienteComponent, canActivate: [AuthGuardService] },
  { path: 'cliente/:id' , component: ClienteCadComponent, canActivate: [AuthGuardService] },
  { path: 'usuario' , component: UsuarioComponent, canActivate: [AuthGuardService] },
  { path: 'usuario/:id' , component: UsuarioCadComponent, canActivate: [AuthGuardService] },
  { path: 'login', component: LoginComponent },
  { path: 'badrequest', component: BadRequestComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: 'notfound', component: NotFoundComponent },
  { path: '**', component: NotFoundComponent }

];
@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
