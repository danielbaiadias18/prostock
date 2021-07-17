import { Component, OnInit } from '@angular/core';
import { iCliente } from 'src/app/models/Cliente';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent implements OnInit {

  clientes: iCliente[] = [
    {
      Id: 1,
      Nome: 'Janin da Silva',
      Cpf: '804.249.800-45',
      Telefone: '(14) 80524-4746',
      Email: 'JaninUmCincoSete@hotmail.com'
    },
    {
      Id: 2,
      Nome: 'Daniel Bias Daia',
      Cpf: '198.201.570-56',
      Telefone: '(33) 47273-5026',
      Email: 'DanielzinDosCria@gmail.com'
    },
    {
      Id: 1,
      Nome: 'Filipin Pjl',
      Cpf: '321.884.380-43',
      Telefone: '(28) 30114-2554',
      Email: 'FelipeFreeFire@hotmail.com'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  excluirCliente(idCliente: number){
    this.clientes = this.clientes.filter(x => x.Id != idCliente);
  }

}
