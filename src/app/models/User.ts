import { iUsuario } from "./Usuario";

export interface User {
    cdUsuario: string;
    Login: string;
    cdEmpresa: number;
    Nome: string;
    token: string;
    user: iUsuario;
}