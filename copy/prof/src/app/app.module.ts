import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { DataTablesModule } from 'angular-datatables';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { CustomRadioBtnComponent } from './custom-components/custom-radio-btn/custom-radio-btn.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppheaderComponent } from './appheader/appheader.component';
import { AppmenuComponent } from './appmenu/appmenu.component';
import { AppfooterComponent } from './appfooter/appfooter.component';
import { AppsettingComponent } from './appsetting/appsetting.component';
import { HomeComponent } from './home/home.component';
import { NotfoundComponent } from './erros/notfound/notfound.component';
import { SearchInNavService } from './services/search-in-nav.service';
import { AuthenticationService } from './services/authentication.service';
import { LoginComponent } from './login/login.component';
import { BarsService } from './services/bars.service';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { ApiService } from './services/api.service';
import { QuestaoComponent } from './pages/questao/questao.component';
import { FiltroQuestaoComponent } from './modal/filtro-questao/filtro-questao.component';
import { CapitalizarPipe } from './pipes/capitalizar.pipe';
import { SortFormPipe } from './pipes/sort-form.pipe';
import { LoadingScreenComponent } from './helpers/loading-screen/loading-screen.component';
import { LoadingService } from './helpers/loading-screen/loading-screen.service';
import { LayoutService } from './services/app.layout.services';
import { AvaliacaoComponent } from './pages/avaliacao/avaliacao.component';
import { FiltroAvaliacaoComponent } from './modal/filtro-avaliacao/filtro-avaliacao.component';
import { VisualizarQuestaoComponent } from './modal/visualizar-questao/visualizar-questao.component';
import { QuestaoViewComponent } from './custom-components/questao-view/questao-view.component';
import { VisualizarAvaliacaoComponent } from './modal/visualizar-avaliacao/visualizar-avaliacao.component';
import { CadastroQuestaoComponent } from './pages/cadastro-questao/cadastro-questao.component';
import { CustomFlagComponent } from './custom-components/custom-flag/custom-flag.component';
import { CadastroAvaliacaoComponent } from './pages/cadastro-avaliacao/cadastro-avaliacao.component';
import { DuplicarAvaliacaoComponent } from './modal/duplicar-avaliacao/duplicar-avaliacao.component';
import { AutoSizeInputModule } from 'ngx-autosize-input' ;
//#region Definindo locale do datepicker

import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { VincularAlunosAvaliacaoComponent } from './modal/vincular-alunos-avaliacao/vincular-alunos-avaliacao.component';
import { DatePipe } from '@angular/common';
import { DecimalPipe } from '@angular/common';
import { ConfigService } from './services/config.service';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { AnularQuestaoComponent } from './modal/anular-questao/anular-questao.component';
import { VincularQuestaoService } from './services/vincular-questao.service';
import { VisualizarVincularQuestaoComponent } from './modal/visualizar-vincular-questao/visualizar-vincular-questao.component';
import { Erro500Component } from './erros/erro500/erro500.component';
import { DuplicarQuestaoComponent } from './pages/duplicar-questao/duplicar-questao.component';
import { AvaliacaoCorrecaoComponent } from './pages/avaliacao-correcao/avaliacao-correcao.component';
import { ExibirNotaComponent } from './modal/exibir-nota/exibir-nota.component';
import { VisualizarAvaliacaoCorrecaoComponent } from './modal/visualizar-avaliacao-correcao/visualizar-avaliacao-correcao.component';
import { QuestaoCorrecaoViewComponent } from './custom-components/questao-correcao-view/questao-correcao-view.component';
import { RelatorioMonitoramentoComponent } from './pages/relatorio-monitoramento/relatorio-monitoramento.component';
import { ProgressInterceptor } from './helpers/progress.interceptor';
import {
  LoadingBarComponent,
  LoadingProgressService,
} from './custom-components/loading-bar/loading-bar.component';
import { EditorDirective } from './directives/editor.directive';
import { AvaliacaoUsoQuestaoComponent } from './custom-components/avaliacao-uso-questao/avaliacao-uso-questao.component';
import { CentralVideoComponent } from './pages/central-video/central-video.component';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { VideoComponent } from './pages/video/video.component';
import { FiltroVideoComponent } from './modal/filtro-video/filtro-video.component';
import { QuestaoValidacaoComponent } from './pages/questao-validacao/questao-validacao.component';
import { UnauthorizedComponent } from './erros/unauthorized/unauthorized.component';
import { ConsultarDirective } from './directives/acesso/consultar.directive';
import { IncluirDirective } from './directives/acesso/incluir.directive';
import { AlterarDirective } from './directives/acesso/alterar.directive';
import { ExcluirDirective } from './directives/acesso/excluir.directive';
import { AcessoModule } from './directives/acesso/acesso.module';
import { QuestaoValidarComponent } from './modal/questao-validar/questao-validar.component';
import { EsqueciSenhaComponent } from './modal/esqueci-senha/esqueci-senha.component';
import { EsqueceuSenhaTrocarComponent } from './esqueceu-senha-trocar/esqueceu-senha-trocar.component';
import { TrilhaComponent } from './pages/trilha/trilha.component';
import { FiltroTrilhaComponent } from './modal/filtro-trilha/filtro-trilha.component';
import { CadastroTrilhaComponent } from './pages/cadastro-trilha/cadastro-trilha.component';
import { CadastroModuloItemComponent } from './modal/cadastro-modulo-item/cadastro-modulo-item.component';
import { AvaliacaoCardComponent } from './custom-components/avaliacao-card/avaliacao-card.component';
import { VisualizarVideoComponent } from './modal/visualizar-video/visualizar-video.component';
import { ChatComponent } from './pages/chat/chat.component';

defineLocale('pt-br', ptBrLocale);

//#endregion

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [
    AppComponent,
    AppheaderComponent,
    AppmenuComponent,
    AppfooterComponent,
    AppsettingComponent,
    HomeComponent,
    NotfoundComponent,
    LoginComponent,
    QuestaoComponent,
    FiltroQuestaoComponent,
    CapitalizarPipe,
    SortFormPipe,
    LoadingScreenComponent,
    AvaliacaoComponent,
    FiltroAvaliacaoComponent,
    VisualizarQuestaoComponent,
    QuestaoViewComponent,
    VisualizarAvaliacaoComponent,
    CadastroQuestaoComponent,
    CustomFlagComponent,
    CadastroAvaliacaoComponent,
    CustomRadioBtnComponent,
    DuplicarAvaliacaoComponent,
    VincularAlunosAvaliacaoComponent,
    SafeHtmlPipe,
    AnularQuestaoComponent,
    VisualizarVincularQuestaoComponent,
    Erro500Component,
    DuplicarQuestaoComponent,
    AvaliacaoCorrecaoComponent,
    ExibirNotaComponent,
    VisualizarAvaliacaoCorrecaoComponent,
    QuestaoCorrecaoViewComponent,
    RelatorioMonitoramentoComponent,
    LoadingBarComponent,
    EditorDirective,
    AvaliacaoUsoQuestaoComponent,
    CentralVideoComponent,
    SafeUrlPipe,
    VideoComponent,
    FiltroVideoComponent,
    QuestaoValidacaoComponent,
    UnauthorizedComponent,
    QuestaoValidarComponent,
    EsqueciSenhaComponent,
    EsqueceuSenhaTrocarComponent,
    TrilhaComponent,
    FiltroTrilhaComponent,
    CadastroTrilhaComponent,
    CadastroModuloItemComponent,
    AvaliacaoCardComponent,
    VisualizarVideoComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    DataTablesModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    NgxMaskModule.forRoot(maskConfig),
    NgSelectModule,
    BsDatepickerModule.forRoot(),
    CKEditorModule,
    DragDropModule,
    AcessoModule,
    AutoSizeInputModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ProgressInterceptor, multi: true },
    AuthenticationService,
    SearchInNavService,
    LayoutService,
    BarsService,
    ApiService,
    ConfigService,
    LoadingService,
    DatePipe,
    DecimalPipe,
    VincularQuestaoService,
    LoadingProgressService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
