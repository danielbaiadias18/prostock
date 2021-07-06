import { Component, OnInit, ElementRef, AfterViewInit, ViewChild, HostListener } from '@angular/core';
import { SearchInNavService } from '../services/search-in-nav.service';
import { LayoutService, LayoutUnit } from '../services/app.layout.services';
import { AuthenticationService } from '../services/authentication.service';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { VincularQuestaoService } from '../services/vincular-questao.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

declare var $: JQueryStatic;

@Component({
  selector: 'app-appheader',
  templateUrl: './appheader.component.html',
  styleUrls: ['./appheader.component.scss'],
  animations: [
    trigger('BackToTop', [
      transition(':enter',
        animate('.600s',
          keyframes([
            style({ transform: 'translateY(100%) rotateZ(0deg)', opacity: 0.2, offset: 0 }),
            style({ transform: 'translateY(0) rotateZ(360deg)', opacity: 0.9, offset: 0.33 }),
            style({ transform: 'translateY(70%) scale(1.2)', opacity: 1, offset: 0.9 }),
            style({ transform: 'translateY(0) scale(1)', offset: 1 }),
          ]))),
      transition(':leave',
        animate('.200s',
          keyframes([
            style({ transform: 'translateX(50%)', opacity: 1, paddingLeft: '20px', offset: 0.2 }),
            style({ transform: 'translateX(100%)', opacity: 0, paddingLeft: '20px', offset: 1 })
          ])))
    ]),
  ]
})
export class AppheaderComponent implements OnInit, AfterViewInit {

  @ViewChild('nav') nav: ElementRef;
  show: boolean = false;

  searchParam: string = '';
  constructor(
    private search: SearchInNavService,
    private el: ElementRef,
    private layout: LayoutService,
    private router: Router,
    private auth: AuthenticationService,
    public vincular: VincularQuestaoService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    if (this.nav) {
      this.layout.emitUnitEvent({
        height: $(this.nav.nativeElement).outerHeight(),
        unit: LayoutUnit.Header
      })
    }
  }

  onBlur() {
    this.search.emitSearchChangeEvent(this.searchParam);
  }

  logout() {
    Swal.fire({
      title: 'Deseja realmente sair do sistema?',
      showCancelButton: true,
      cancelButtonText: 'Não',
      confirmButtonColor: '#3085d6',
      //cancelButtonColor: '#d33',
      confirmButtonText: 'Sim'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/login']);
        this.auth.logout();

      }
    })
  }

  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event) {
    this.show = $(event.target).scrollTop() > 0
  }

  scrollToElement($element): void {
    $element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }
}
