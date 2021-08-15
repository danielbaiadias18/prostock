import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BarsService } from 'src/app/services/bars.service';

@Component({
  selector: 'app-bad-request',
  templateUrl: './bad-request.component.html',
  styleUrls: ['./bad-request.component.scss']
})
export class BadRequestComponent implements OnInit {

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
