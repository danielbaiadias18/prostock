import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ClienteCadComponent } from './pages/cliente-cad/cliente-cad.component';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { LoginComponent } from './pages/login/login.component';
import { ProdutoCadComponent } from './pages/produto-cad/produto-cad.component';
import { ProdutoComponent } from './pages/produto/produto.component';

const routerOptions: ExtraOptions = {
  useHash: false,
  anchorScrolling: 'enabled',
  // ...any other options you'd like to use
};

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'produto' , component: ProdutoComponent},
  { path: 'produto/:id' , component: ProdutoCadComponent},
  { path: 'cliente' , component: ClienteComponent},
  { path: 'cliente/:id' , component: ClienteCadComponent},
  { path: 'login', component: LoginComponent },
  // { path: 'erro', component: Erro500Component },
  // { path: '**', component: NotfoundComponent }

];
@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
