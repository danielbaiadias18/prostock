import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { PermissaoService } from 'src/app/services/permissao/permissao.service';

@Directive({
  selector: '[incluir]',
})
export class IncluirDirective implements OnInit {
  @Input() incluir: string;

  constructor(
    private el: ElementRef,
    private permissao: PermissaoService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    //console.log(this.el);
    this.permissao.get().then((map) => {
      let permissao = map.get(this.incluir);
      if (!permissao.idIncluir)
        this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
    });
  }
}
