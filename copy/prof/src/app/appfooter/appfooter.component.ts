import { Component, OnInit, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { LayoutService, LayoutUnit } from '../services/app.layout.services';

declare var $: JQueryStatic;

@Component({
  selector: 'app-appfooter',
  templateUrl: './appfooter.component.html',
  styleUrls: ['./appfooter.component.scss']
})
export class AppfooterComponent implements OnInit, AfterViewInit {
  @ViewChild('footer') footer: ElementRef;
  constructor(private el: ElementRef, private layout: LayoutService) {
  }
  ano: number = new Date().getFullYear();

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    if (this.footer) {
      this.layout.emitUnitEvent({
        height: $(this.footer.nativeElement).outerHeight(),
        unit: LayoutUnit.Footer
      })
    }
  }

}
