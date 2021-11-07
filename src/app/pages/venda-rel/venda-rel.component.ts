import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { iVenda } from 'src/app/models/Venda';

import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
(window as any).html2canvas = html2canvas;

@Component({
  selector: 'app-venda-rel',
  templateUrl: './venda-rel.component.html',
  styleUrls: ['./venda-rel.component.scss']
})

export class VendaRelComponent implements OnInit {

  form: FormGroup;
  dateInit: any = "";
  dateEnd: any = "";
  
  constructor(private http: HttpClient, private router: Router, private fb: FormBuilder) {
    this.form = this.fb.group({
      dateInit: ['', Validators.required],
      dateEnd: ['', Validators.required],
    });
   }

  vendas: any = null;
  
  ngOnInit(): void {
  }
  
  imprimir(){
    this.dateInit = this.form.controls['dateInit'].value;
    this.dateEnd = this.form.controls['dateEnd'].value;

    this.http.get(`${environment.api_url}venda/report/general?dateInit=${this.dateInit.replaceAll("/","")}&dateEnd=${this.dateEnd.replaceAll("/","")}`)
      .subscribe((response: any) => {
        this.vendas = response;
        console.log(this.vendas, "vendas");
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
  
}
