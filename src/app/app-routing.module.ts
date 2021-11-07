import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './guards/auth-guard.service';
import { HomeComponent } from './home/home.component';
import { VendaDetalheComponent } from './modals/venda-detalhe/venda-detalhe.component';
import { ClienteCadComponent } from './pages/cliente-cad/cliente-cad.component';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { BadRequestComponent } from './pages/errors/bad-request/bad-request.component';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { UnauthorizedComponent } from './pages/errors/unauthorized/unauthorized.component';
import { EstoqueCadComponent } from './pages/estoque-cad/estoque-cad.component';
import { EstoqueComponent } from './pages/estoque/estoque.component';
import { LoginComponent } from './pages/login/login.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { ProdutoCadComponent } from './pages/produto-cad/produto-cad.component';
import { ProdutoRelComponent } from './pages/produto-rel/produto-rel.component';
import { ProdutoComponent } from './pages/produto/produto.component';
import { UsuarioCadComponent } from './pages/usuario-cad/usuario-cad.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { VendaCadComponent } from './pages/venda-cad/venda-cad.component';
import { VendaDetalheRelComponent } from './pages/venda-detalhe-rel/venda-detalhe-rel.component';
import { VendaRelComponent } from './pages/venda-rel/venda-rel.component';
import { VendaComponent } from './pages/venda/venda.component';

const routerOptions: ExtraOptions = {
  useHash: false,
  anchorScrolling: 'enabled',
  // ...any other options you'd like to use
};

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuardService] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] },
  { path: 'produto' , component: ProdutoComponent, canActivate: [AuthGuardService] },
  { path: 'produto-rel' , component: ProdutoRelComponent, canActivate: [AuthGuardService] },
  { path: 'produto/:id' , component: ProdutoCadComponent, canActivate: [AuthGuardService] },
  { path: 'cliente' , component: ClienteComponent, canActivate: [AuthGuardService] },
  { path: 'cliente/:id' , component: ClienteCadComponent, canActivate: [AuthGuardService] },
  { path: 'usuario' , component: UsuarioComponent, canActivate: [AuthGuardService] },
  { path: 'usuario/:id' , component: UsuarioCadComponent, canActivate: [AuthGuardService] },
  { path: 'venda-rel' , component: VendaRelComponent, canActivate: [AuthGuardService] },
  { path: 'venda-detalhe-rel' , component: VendaDetalheRelComponent, canActivate: [AuthGuardService] },
  { path: 'venda' , component: VendaComponent, canActivate: [AuthGuardService] },
  { path: 'venda/:id' , component: VendaCadComponent, canActivate: [AuthGuardService] },
  { path: 'estoque' , component: EstoqueComponent, canActivate: [AuthGuardService] },
  { path: 'estoque/:id' , component: EstoqueCadComponent, canActivate: [AuthGuardService] },
  { path: 'perfil' , component: PerfilComponent, canActivate: [AuthGuardService] },
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
