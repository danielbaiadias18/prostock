import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { SearchInNavService } from '../services/search-in-nav.service';
import { AuthenticationService } from '../services/authentication.service';
import { LayoutService, LayoutUnit } from '../services/app.layout.services';
import { ConfigService } from '../services/config.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

//#region Menu

const items: iNavItem[] = [
  {
    path: ['/questao'],
    consulta: '/questao',
    name: 'Cadastro de Questões',
    icon: 'fas fa-edit',
    children: [],
  },
  {
    path: ['/questaovalidacao'],
    consulta: '/questao',
    name: 'Validação de Questões',
    icon: 'fas fa-clipboard-check',
    children: [],
  },
  {
    path: ['/avaliacao'],
    consulta: '/avaliacao',
    name: 'Cadastro de Avaliação',
    icon: 'fas fa-book-open',
    children: [],
  },
  {
    path: ['/avaliacaocorrecao'],
    consulta: '/avaliacaocorrecao',
    name: 'Correção de Avaliação',
    icon: 'fas fa-book-reader',
    children: []
  },
  {
    path: ['/video'],
    consulta: '/video',
    name: 'Central de Vídeos',
    icon: 'fas fa-play-circle',
    children: [],
  },
  {
    path: ['/trilha'],
    consulta: '/trilha',
    name: 'Trilhas',
    icon: 'fas fa-code-branch',
    children: [],
  },

  {
    path: ['/chatticket'],
    consulta: '/chatticket',
    name: 'Ticket',
    icon: 'fas fa-comments',
    children: []
  },
  // {
  //   name: 'Relatórios',
  //   icon: 'fas fa-file-alt',
  //   children: [
  //     {
  //       path: ['relatoriomonitoramento'],
  //       name: 'Relatório de Monitoramento',
  //       children: []
  //     },
  //     {
  //       location: 'NEG_DESEMPENHO_HABILIDADE_REL.ASPX',
  //       name: 'Desempenho por Habilidade e Conteúdo',
  //       children: []
  //     },
  //     {
  //       name: 'Desempenho Questão',
  //       children: [],
  //       location: 'NEG_DESEMPENHO_QUESTAO_REL.ASPX'
  //     },
  //     // {
  //     //   location: 'MEDIA_AREA_REL.ASPX',
  //     //   name: 'Média de Notas por Área',
  //     //   children: []
  //     // },
  //     {
  //       location: 'NEG_PERCENTUAL_ACERTO_QUESTAO_REL.ASPX',
  //       name: 'Percentual de Acertos por Questão',
  //       children: []
  //     },
  //     {
  //       location: 'NEG_PERCENTUAL_ACERTO_DISCIPLINA_REL.ASPX',
  //       name: 'Percentual de Acertos por Disciplina',
  //       children: []
  //     },
  //     {
  //       location: 'NEG_NOTAS_DISCIPLINA_REL.ASPX',
  //       name: 'Notas por disciplina',
  //       children: []
  //     },
  //     {
  //       location: 'NEG_FAIXA_DESEMPENHO_TURMA_REL.ASPX',
  //       name: 'Relatório de Faixa de Desempenho',
  //       children: []
  //     }

  //   ]
  // }
];

//#endregion
@Component({
  selector: 'app-appmenu',
  templateUrl: './appmenu.component.html',
  styleUrls: ['./appmenu.component.scss'],
})
export class AppmenuComponent implements OnInit, AfterViewInit, OnDestroy {
  searchParam: string = '';
  subscription: any;
  items = items;
  parametros: string;
  urlBase: string;

  @ViewChild('sideBar') sideBar: ElementRef;

  constructor(
    private search: SearchInNavService,
    public auth: AuthenticationService,
    private el: ElementRef,
    config: ConfigService,
    private router: Router,
    private layout: LayoutService
  ) {
    this.parametros = `?Token=${auth.currentUserValue?.token}&cdEmpresa=${auth.currentUserValue?.cdEmpresa}`;
    config.Ready((config) => (this.urlBase = config.tokenLink));
  }

  filter(navItem: iNavItem, search: string): boolean {
    return navItem.name.toLowerCase().indexOf(search.toLowerCase()) > -1;
  }

  ngOnInit(): void {
    this.subscription = this.search
      .getSearchChangeEmitter()
      .subscribe((item) => this.setSearchParam(item));
  }

  ngAfterViewInit() {
    if (this.sideBar) {
      this.layout.emitUnitEvent({
        height: $(this.sideBar.nativeElement).outerHeight(),
        unit: LayoutUnit.SideBar,
      });
    }
  }

  setSearchParam(search: string) {
    if (!search) this.items = items;

    this.items = [].concat(items);
    this.items = items.map((x) => {
      return {
        path: x.path,
        consulta: x.consulta,
        location: x.location,
        name: x.name,
        icon: x.icon,
        children:
          x.children.length > 0
            ? x.children.filter((x) => this.filter(x, search))
            : [],
      };
    });

    return this.items.filter(
      (x) => x.children.length > 0 || this.filter(x, search)
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  logout() {
    Swal.fire({
      title: 'Deseja realmente sair do sistema?',
      showCancelButton: true,
      cancelButtonText: 'Não',
      confirmButtonColor: '#3085d6',
      //cancelButtonColor: '#d33',
      confirmButtonText: 'Sim',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/login']);
        this.auth.logout();
      }
    });
  }

  getFullLocation(loc: string) {
    return this.urlBase + loc + this.parametros;
  }
}

//NavItem deve ter path preenchido ou location obrigatóriamente
export interface iNavItem {
  path?: string[];
  consulta: string;
  icon?: string;
  name: string;
  children: iNavItem[];
  location?: string;
}
