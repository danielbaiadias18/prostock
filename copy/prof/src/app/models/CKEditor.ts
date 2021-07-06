'use strict';

// The editor creator to use.
import * as Editor from '../../assets/plugins/ckeditor/build/ckeditor';


export default class CKEditor extends Editor { }

CKEditor.defaultConfig = {
    toolbar: {
        items: [
            'heading',
            '|',
            'fontFamily',
            'fontSize',
            'fontColor',
            'fontBackgroundColor',
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            'removeFormat',
            '|',
            'alignment',
            'indent',
            'outdent',
            '|',
            'imageUpload',
            'blockQuote',
            'insertTable',
            'mediaEmbed',
            '|',
            'MathType',
            'ChemType',
            '|',
            'undo',
            'redo'
        ]
    },
    language: 'pt-br',
    image: {
        toolbar: [
            'imageTextAlternative',
            '|',
            'imageStyle:alignLeft',
            'imageStyle:full',
            'imageStyle:alignRight'
        ],
        styles: [
            'full',
            'alignLeft',
            'alignRight'
        ]
    },
    table: {
        contentToolbar: [
            'tableColumn',
            'tableRow',
            'mergeTableCells',
            'tableCellProperties',
            'tableProperties'
        ]
    },
    fontFamily: {
        options: [
            'default',                      
            'Cambria',
            'Arial',
            'Courier New',
            'Georgia',
            'Lucida Sans Unicode',
            'Tahoma',
            'Times New Roman',
            'Trebuchet MS',
            'Verdana'
        ],
        supportAllValues: true
    },
    licenseKey: '',
};