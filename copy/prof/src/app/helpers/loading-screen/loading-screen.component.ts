import { Component, OnInit, ElementRef, Renderer2, OnDestroy, AfterViewInit } from '@angular/core';
import { LoadingService } from './loading-screen.service';

@Component({
  selector: 'loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss']
})
export class LoadingScreenComponent implements OnInit, OnDestroy {

  isLoading: boolean = false;
  subscription: any;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private service: LoadingService) {
    this.subscription = this.service.getEventEmitter().subscribe(func => this.start(func));
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private present() {
    this.renderer.addClass(this.el.nativeElement.parentElement, 'loader');
    this.isLoading = true;
  }

  private dismiss() {
    this.renderer.removeClass(this.el.nativeElement.parentElement, 'loader');
    this.isLoading = false;
  }

  start(func: () => Promise<void>) {
    this.present();
    func().then(() => setTimeout(() => this.dismiss(), 150));
  }

}
