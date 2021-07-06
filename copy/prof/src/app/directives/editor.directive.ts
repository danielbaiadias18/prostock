import { Directive, OnInit } from '@angular/core';
import { CKEditorComponent } from '@ckeditor/ckeditor5-angular';

@Directive({
  selector: 'ckeditor'
})
export class EditorDirective implements OnInit {

  constructor(private e: CKEditorComponent) { }
  ngOnInit(): void {
    setTimeout(() => {
      // this.e.editorInstance.execute('fontFamily', { value: 'Cambria' });
      // this.e.editorInstance.execute('fontSize', { value: 'big' });
    }, 1000)
  }
}
