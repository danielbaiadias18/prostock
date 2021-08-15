import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BarsService } from 'src/app/services/bars.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor(private bars: BarsService, private router: Router) { }

  ngOnInit(): void {
  }

  redrc(){
    this.router.navigate(['']);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.bars.emitCanSeeBarsEvent(false);
    }, 0);
  }
}
