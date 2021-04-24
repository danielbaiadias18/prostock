import { Component, OnInit } from '@angular/core';

const items: iNavItem[] = [
  {
    path: ['produto'],
    name: 'Cadastro de Produtos',
    icon: 'far fa-edit',
    children: []
  },
  
];

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  constructor() {
   }

  ngOnInit(): void {
  }

  
  logout() {
  }

  getFullLocation(loc: string) {
    // return "" + loc + this.parametros;
  }
}

//NavItem deve ter path preenchido ou location obrigatóriamente
export interface iNavItem {
  path?: string[];
  icon?: string;
  name: string;
  children: iNavItem[];
  location?: string;
}
