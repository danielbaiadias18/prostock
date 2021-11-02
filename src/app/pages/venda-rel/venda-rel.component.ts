import { Component, OnInit } from '@angular/core';
import { jsPDF } from "jspdf";

@Component({
  selector: 'app-venda-rel',
  templateUrl: './venda-rel.component.html',
  styleUrls: ['./venda-rel.component.scss']
})

export class VendaRelComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    var doc = new jsPDF();
    doc.text(20, 20, 'Hello world!');
    doc.text(20, 30, 'This is client-side Javascript, pumping out a PDF.');
    doc.addPage();
    doc.text(20, 20, 'Do you like that?');

    doc.save('Test.pdf');
  }

}
