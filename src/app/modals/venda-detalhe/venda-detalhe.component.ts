import { Component, Input, OnInit } from '@angular/core';
import { iVenda } from 'src/app/models/Venda';

@Component({
  selector: 'app-venda-detalhe',
  templateUrl: './venda-detalhe.component.html',
  styleUrls: ['./venda-detalhe.component.scss']
})
export class VendaDetalheComponent implements OnInit {

  constructor() { }
  @Input() public venda!: iVenda;

  ngOnInit(): void {
  }

}
