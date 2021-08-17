import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-venda',
  templateUrl: './venda.component.html',
  styleUrls: ['./venda.component.scss']
})
export class VendaComponent implements OnInit {

  constructor(private http: HttpClient) { }
  
  vendas = true;
  
  ngOnInit(): void {
    this.http.get(`${environment.api_url}venda`)
      .subscribe((response: any) => {
        console.log(response)
        // this.vendas = response;
      });
  }

}
