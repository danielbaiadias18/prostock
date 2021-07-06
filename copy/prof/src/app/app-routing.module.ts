import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotfoundComponent } from './erros/notfound/notfound.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './helpers/auth.guard';
import { QuestaoComponent } from './pages/questao/questao.component';
import { AvaliacaoComponent } from './pages/avaliacao/avaliacao.component';
import { CadastroQuestaoComponent } from './pages/cadastro-questao/cadastro-questao.component';
import { CadastroAvaliacaoComponent } from './pages/cadastro-avaliacao/cadastro-avaliacao.component';
import { Erro500Component } from './erros/erro500/erro500.component';
import { DuplicarQuestaoComponent } from './pages/duplicar-questao/duplicar-questao.component';
import { AvaliacaoCorrecaoComponent } from './pages/avaliacao-correcao/avaliacao-correcao.component';
import { RelatorioMonitoramentoComponent } from './pages/relatorio-monitoramento/relatorio-monitoramento.component';
import { CentralVideoComponent } from './pages/central-video/central-video.component';
import { VideoComponent } from './pages/video/video.component';
import { QuestaoValidacaoComponent } from './pages/questao-validacao/questao-validacao.component';
import { UnauthorizedComponent } from './erros/unauthorized/unauthorized.component';
import { Configurar, Permissao } from './helpers/permission.guard';
import { EsqueceuSenhaTrocarComponent } from './esqueceu-senha-trocar/esqueceu-senha-trocar.component';
import { TrilhaComponent } from './pages/trilha/trilha.component';
import { CadastroTrilhaComponent } from './pages/cadastro-trilha/cadastro-trilha.component';
import { ChatComponent } from './pages/chat/chat.component';

const routerOptions: ExtraOptions = {
  useHash: false,
  anchorScrolling: 'enabled',
  // ...any other options you'd like to use
};

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: 'questao',
    component: QuestaoComponent,
    canActivate: [AuthGuard, Permissao],
    ...Configurar('/questao', 'consultar'),
  },
  {
    path: 'questao/:cdQuestao',
    component: CadastroQuestaoComponent,
    canActivate: [AuthGuard, Permissao],
    ...Configurar('/questao', 'consultar', 'incluir', 'alterar'),
  },
  {
    path: 'questaovalidacao',
    component: QuestaoValidacaoComponent,
    canActivate: [AuthGuard, Permissao],
    ...Configurar('/questao', 'consultar', 'incluir', 'alterar'),
  },
  {
    path: 'duplicarquestao/:cdQuestao',
    component: DuplicarQuestaoComponent,
    canActivate: [AuthGuard, Permissao],
    ...Configurar('/questao', 'consultar', 'incluir'),
  },
  {
    path: 'avaliacao',
    component: AvaliacaoComponent,
    canActivate: [AuthGuard, Permissao],
    ...Configurar('/avaliacao', 'consultar'),
  },
  {
    path: 'avaliacaocorrecao',
    component: AvaliacaoCorrecaoComponent,
    canActivate: [AuthGuard],
    ...Configurar('/avaliacaocorrecao', 'consultar', 'incluir', 'alterar'),
  },
  {
    path: 'relatoriomonitoramento',
    component: RelatorioMonitoramentoComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'avaliacao/:cdAvaliacao',
    component: CadastroAvaliacaoComponent,
    canActivate: [AuthGuard, Permissao],
    ...Configurar('/avaliacao', 'consultar', 'incluir', 'alterar'),
  },
  {
    path: 'video',
    component: VideoComponent,
    canActivate: [AuthGuard, Permissao],
    ...Configurar('/video', 'consultar'),
  },
  {
    path: 'video/:cdVideo',
    component: CentralVideoComponent,
    canActivate: [AuthGuard, Permissao],
    ...Configurar('/video', 'consultar', 'incluir', 'alterar'),
  },
  {
    path: 'trilha',
    component: TrilhaComponent,
    canActivate: [AuthGuard, Permissao],
    ...Configurar('/trilha', 'consultar'),
  },
  {
    path: 'chatticket',
    component: ChatComponent,
    canActivate: [AuthGuard, Permissao],
    ...Configurar('/chatticket', 'consultar','incluir', 'alterar'),
  },
  {
    path: 'trilha/:cdTrilha',
    component: CadastroTrilhaComponent,
    canActivate: [AuthGuard, Permissao],
    ...Configurar('/trilha', 'consultar', 'incluir', 'alterar'),
  },
  { path: 'esquecisenhatrocar/:token', component: EsqueceuSenhaTrocarComponent },
  { path: 'login', component: LoginComponent },
  { path: 'erro', component: Erro500Component },
  { path: '401', component: UnauthorizedComponent, canActivate: [AuthGuard] },
  { path: '**', component: NotfoundComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
