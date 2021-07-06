import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ErrorInterceptor } from 'src/app/helpers/error.interceptor';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { BarsService } from 'src/app/services/bars.service';

@Component({
  selector: 'app-erro500',
  templateUrl: './erro500.component.html',
  styleUrls: ['./erro500.component.scss']
})
export class Erro500Component implements OnInit, AfterViewInit {

  get previousPage() {
    return ErrorInterceptor.lastRoute;
  }

  constructor(
    private auth: AuthenticationService,
    private bars: BarsService) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.bars.emitCanSeeBarsEvent(this.auth.currentUserValue);
    }, 0);
  }

  ngOnInit(): void {
  }

}
