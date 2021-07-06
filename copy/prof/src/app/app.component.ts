import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { BarsService } from './services/bars.service';
import { Router, NavigationStart } from '@angular/router';
import { LayoutService, LayoutUnitValue, LayoutUnit } from './services/app.layout.services';
import { NgSelectConfig } from '@ng-select/ng-select';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';

declare var $: JQueryStatic;
const locale = 'pt-br';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'avaliacao';
  canSee = true;
  firstTime = true;

  heights: { footer: number, header: number, sideBar: number } =
    {
      footer: 0,
      header: 0,
      sideBar: 0,
    }

  @ViewChild('wrapper') wrapper: ElementRef;

  constructor(
    bars: BarsService,
    layout: LayoutService,
    private renderer: Renderer2,
    private router: Router,
    localeService: BsLocaleService,
    config: NgSelectConfig) {

    localeService.use(locale);

    config.clearAllText = "Limpar";
    config.loadingText = "Carregando...";
    config.notFoundText = "Não foi encontrado nenhum item";
    config.typeToSearchText = "Digite aqui para pesquisar";

    bars.getCanSeeBarsEmitter().subscribe(
      canSee => {
        if (!canSee) {
          $(this.wrapper.nativeElement).css('margin-left', '0');
        } else {
          $(this.wrapper.nativeElement).removeAttr('style');
        }

        this.canSee = canSee
      });

    layout.getUnitEmitter().subscribe((unit: LayoutUnitValue) => {
      switch (unit.unit) {
        case LayoutUnit.Footer:
          this.heights.footer = unit.height;
          break;
        case LayoutUnit.Header:
          this.heights.header = unit.height;
          break;
        case LayoutUnit.SideBar:
          this.heights.sideBar = unit.height;
          break;
      }
    });
  }



  subtract(...values: number[]) {
    values = values.sort((a, b) => b - a);

    let total = values[0];

    for (let val of values.slice(1))
      total -= val;

    return total;
  }

  ngOnInit(): void {
    this.router.events.subscribe(e => {
      var ua = navigator.userAgent;

      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)) {
        this.renderer.removeClass(document.body, 'sidebar-open');
        this.renderer.addClass(document.body, 'sidebar-closed');
      }

      if (e instanceof NavigationStart) {
        $(this.wrapper.nativeElement).css('min-height',
          this.subtract(this.heights.footer, this.heights.header, this.heights.sideBar) + 'px')
      }
    })
  }
}
