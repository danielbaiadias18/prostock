import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
(window as any).html2canvas = html2canvas;

@Component({
  selector: 'app-produto-rel',
  templateUrl: './produto-rel.component.html',
  styleUrls: ['./produto-rel.component.scss']
})
export class ProdutoRelComponent implements OnInit {

  form: FormGroup;
  dateInit: any = "";
  dateEnd: any = "";
  vendas: any = [];

  constructor(private http: HttpClient, private router: Router, private fb: FormBuilder) {
    this.form = this.fb.group({
      dateInit: ['', Validators.required],
      dateEnd: ['', Validators.required],
    });
  }


  ngOnInit(): void {
  }

  imprimir() {
    this.dateInit = this.form.controls['dateInit'].value;
    this.dateEnd = this.form.controls['dateEnd'].value;

    this.http.get(`${environment.api_url}venda/report/product?dateInit=${this.dateInit.replaceAll("/", "")}&dateEnd=${this.dateEnd.replaceAll("/", "")}`)
      .subscribe((response: any) => {
        // response.forEach(element => {
          
        // });
        this.vendas = response;
      });

    var doc = new jsPDF();
    setTimeout(() => {
      doc.html(document.getElementById('vendaDiv')!, {
        callback: function (doc) {
          doc.output('dataurlnewwindow');
        },
        width: 100,
        windowWidth: 250
      })
    }, 500);
  }

}
