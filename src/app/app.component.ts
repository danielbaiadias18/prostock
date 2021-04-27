import { Component, ElementRef, ViewChild } from '@angular/core';
import { BarsService } from './services/bars.service';

// declare var $: JQueryStatic;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'prostock';

  canSee = true;
  
  // @ViewChild('wrapper') wrapper: ElementRef;
  
 constructor(private bars: BarsService) {

  this.bars.getCanSeeBarsEmitter().subscribe(
    canSee => {
      if (!canSee) {
        // $(this.wrapper.nativeElement).css('margin-left', '0');
      } else {
        // $(this.wrapper.nativeElement).removeAttr('style');
      }

      this.canSee = canSee
    });
 }

}
