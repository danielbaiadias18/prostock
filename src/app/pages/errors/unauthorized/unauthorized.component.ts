import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BarsService } from 'src/app/services/bars.service';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss']
})
export class UnauthorizedComponent implements OnInit {

  constructor(private bars: BarsService, private router: Router) { }

  ngOnInit(): void {
  }

  redct(){
    this.router.navigate([''])
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.bars.emitCanSeeBarsEvent(false);
    }, 0);
  }
}
