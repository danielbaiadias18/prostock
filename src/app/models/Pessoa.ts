import { iEndereco } from "./Endereco";

export interface iPessoa{
    nome: string;
    cpf: string;
    telefone: string;
    email: string;
    enderecos: iEndereco[];
}