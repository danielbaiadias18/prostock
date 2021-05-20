import { Component, OnInit, ViewChild } from '@angular/core';
import { iProduto } from 'src/app/models/Produto';
// import {DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.scss']
})
export class ProdutoComponent implements OnInit {

  // @ViewChild(DataTableDirective) dt: DataTableDirective;
  // dtOptions: DataTables.Settings = {}

  produtos: iProduto[] = [];
  constructor() { }

  ngOnInit(): void {
  }

  excluirProduto(produto: iProduto){

  }

}
