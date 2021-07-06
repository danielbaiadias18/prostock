export interface iTrilhaModulo{
  cdTrilhaModulo: number;
  nmModulo: string;
  cdTrilha: number;
  ordem: number;
  Itens: iTrilhaModuloItem[];
}

export interface iTrilhaModuloItem{
  cdItemModulo: number;
  nmItemModulo: string;
  cdModulo: number;
  cdAvaliacao: number;
  cdVideo: number;
  texto: string;
  ordem: number;
  cdTipo: number;
  link: string;
  textVideo: string;
}

export interface iTrilhaModuloItemTipo{
  cdTipo: number;
  nmTipo: string;
}
