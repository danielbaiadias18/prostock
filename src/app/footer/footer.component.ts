import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor() { }
  counter: number = 0;
  ngOnInit(): void {
  }

  easterEgg() {
    this.counter++;
    if (this.counter == 21){
      alert('Você achou um EasterEgg!!')
      this.counter = 0;
    }
  }

}
