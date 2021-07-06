import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { PermissaoService } from 'src/app/services/permissao/permissao.service';

@Directive({
  selector: '[excluir]',
})
export class ExcluirDirective implements OnInit {
  @Input() excluir: string;

  constructor(
    private el: ElementRef,
    private permissao: PermissaoService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.permissao.get().then((map) => {
      let permissao = map.get(this.excluir);
      if (!permissao.idExcluir)
        this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
    });
  }
}
