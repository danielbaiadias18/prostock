import { FormGroup, FormArray } from '@angular/forms';

export class Variantes {
    public static Portuguese: DataTables.LanguageSettings = {
        search: "Pesquisar",
        emptyTable: "Nenhum registro encontrado",
        processing: "Processando...",
        lengthMenu: "Mostrar _MENU_ registros",
        searchPlaceholder: "",
        info: "Mostrando de _START_ até _END_ de _TOTAL_ registros",
        infoEmpty: "Mostrando nenhum registro",
        infoFiltered: "(filtrado de _MAX_ registos no total)",
        infoPostFix: "",
        url: "",
        paginate: {
            first: "Primeira",
            last: "Última",
            next: "Próxima",
            previous: "Anterior"
        },
        aria: {
            sortAscending: "Ordenar colunas de forma ascendente",
            sortDescending: "Ordenar colunas de forma descendente"
        }
    }

    public static EditorConfig(height: string) {
        let temp = {
            height: height,
            lang: 'pt-BR'
        }

        return temp;
    }

    public static markFormGroupTouched(formGroup: FormGroup) {
        (<any>Object).values(formGroup.controls).forEach(control => {
            control.markAsTouched();
            control.markAsDirty();

            if (control.controls) {
                this.markFormGroupTouched(control);
            }
        });
    }

    public static markFormArrayTouched(formArray: FormArray) {
        for (let index = 0; index < formArray.length; index++) {
           // console.log(formArray, formArray as FormArray);
            (<any>Object).values(formArray.controls).forEach(control => {
                control.markAsTouched();
                control.markAsDirty();

                if (control.controls) {
                    this.markFormGroupTouched(control);
                }

                if(Array.isArray(control.controls)){
                    this.markFormArrayTouched(control);
                }
            });
        }
    }

    public static icons: Map<number, string> = new Map<number, string>([
        [1, 'fas fa-align-justify'],
        [2, 'fas fa-tasks'],
        [3, 'fas fa-arrows-alt'],
        [4, 'fas fa-th-list']
    ])
}
