import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgTypeToSearchTemplateDirective } from '@ng-select/ng-select/lib/ng-templates.directive';
import { DataTableDirective } from 'angular-datatables';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { iAvaliacao } from 'src/app/models/Avaliacao';
import { iVideo } from 'src/app/models/CentralVideo';
import { iDisciplina } from 'src/app/models/Disciplina';
// import { iTrilhaModuloItem, iTrilhaModuloItemTipo } from 'src/app/models/TrilhaModulo';
import { Variantes } from 'src/app/models/Variantes';
import { ApiService, HttpMethod, iModel } from 'src/app/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cadastro-modulo-item',
  templateUrl: './cadastro-modulo-item.component.html',
  styleUrls: ['./cadastro-modulo-item.component.scss']
})
export class CadastroModuloItemComponent implements OnInit {

  form: FormGroup;
  model: iModel;

  VideoAvaliacao: Subject<iVideo | iAvaliacao> = new Subject();

  //trilhaModuloItem: iTrilhaModuloItem;

  disciplinas: number[];
  cdSerie: number;
  cdAreaConhecimento: number;

  cdTipo: number;

  videos: iVideo[] = [];
  avaliacoes: iAvaliacao[] = [];

  videoSel: iVideo = null;
  avaliacaoSel: iAvaliacao = null;

  dtOptions: DataTables.Settings = {};
  constructor(
    private api: ApiService,
    private bsModalRef: BsModalRef,
    private fb: FormBuilder,
  ) {
    this.form = fb.group({
      cdItemModulo: [''],
      cdTipo: ['', Validators.required],
      cdAvaliacao: [''],
      cdVideo: [''],
    }, { validators: this.validaTipoObrigatoriedade });

    this.dtOptions = {
      language: Variantes.Portuguese,
      order: [[0, 'desc']],
      pageLength: 6,
      columnDefs: [
        {
          targets: [0],
          searchable: false,
          orderable: false
        },
      ]
    }
  }

  ngOnInit(): void {
    this.form.controls.cdTipo.patchValue(this.cdTipo);

    let tipo = this.form.get('cdTipo').value;

    let model = {
      cdAreaConhecimento: this.cdAreaConhecimento,
      cdSerie: this.cdSerie,
      disciplinas: this.disciplinas
    }

    if (tipo == 2) {
      this.api.api(HttpMethod.POST, 'video/portrilha', model).then((res) => {
        this.videos = res;
      });
    }
    if(tipo == 3){
      this.api.api(HttpMethod.POST, 'avaliacao/portrilha', model).then((res)=>{
        this.avaliacoes = res;
        //console.log(this.avaliacoes, "avaliacao/portrilha");
      })
    }
  }

  pickVideo(value: iVideo) {
    this.form.controls.cdVideo.patchValue(value.cdVideo);
    this.videoSel = value;
    if(this.videoSel.linkVideo.search('player.vimeo.com/video') == -1)
      this.videoSel.linkVideo = value.linkVideo.replace('vimeo.com', 'player.vimeo.com/video');
  }

  pickAvaliacao(value: iAvaliacao){
    this.form.controls.cdAvaliacao.patchValue(value.cdAvaliacao);
    this.avaliacaoSel = value;
  }

  close() {
    Swal.fire({
      icon: 'warning',
      title: 'Deseja mesmo fechar?',
      text: 'Nenhuma alteração será salva!',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then((res) => {
      if(res.isConfirmed)
        this.bsModalRef.hide();
    })
  }

  Salvar() {
    if(this.cdTipo == 2)
      this.VideoAvaliacao.next(this.videoSel);
    if(this.form.get('cdTipo').value == 3)
      this.VideoAvaliacao.next(this.avaliacaoSel);

      this.bsModalRef.hide();
  }

  validaTipoObrigatoriedade(frm: AbstractControl): null | { [key: string]: boolean } {

    if (frm.get('cdTipo').value == 2) {
      const completed = frm.get('cdVideo').value > 0;
      if (completed)
        return null;
      else
        return { "video": true }
    }
    else {
      const completed = frm.get('cdAvaliacao').value > 0;
      if (completed)
        return null;
      else
        return { "avaliacao": true }
    }
  }

}

export enum TipoModuloItem {
  TEXTO = 1,
  VIDEO = 2,
  AVALIACAO = 3
}
