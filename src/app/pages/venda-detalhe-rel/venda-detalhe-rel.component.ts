import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { iVenda } from 'src/app/models/Venda';
import { environment } from 'src/environments/environment';

import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
(window as any).html2canvas = html2canvas;

@Component({
  selector: 'app-venda-detalhe-rel',
  templateUrl: './venda-detalhe-rel.component.html',
  styleUrls: ['./venda-detalhe-rel.component.scss']
})
export class VendaDetalheRelComponent implements OnInit {
  vendas: iVenda[] = [];
  response: any;
  form: FormGroup;
  
  constructor(private http: HttpClient, private router: Router, private modalService: NgbModal, private fb: FormBuilder) {
    this.form = this.fb.group({
      dateInit: [''],
      dateEnd: [''],
      codigo: ['']
    });
   }

  ngOnInit(): void {
    this.pesquisar();
  }

  imprimir(id: number){
    this.http.get(`${environment.api_url}venda/report/${id}`)
    .subscribe((response: any) => {
      this.response = response;
      console.log(this.response);
    });

    var doc = new jsPDF();
    setTimeout(()=>{
      doc.html(document.getElementById('vendaDiv')!, {
        callback: function (doc) {
            doc.output('dataurlnewwindow');
        },
        width:100,
        windowWidth: 250
    })
    },500);
  }

  pesquisar(){
    this.http.get(`${environment.api_url}venda`)
      .subscribe((response: any) => {
        this.vendas = response;
      });
  }

}
