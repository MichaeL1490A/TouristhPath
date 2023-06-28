import { Departamento } from "./departamento";

export class Provincia {
    id: number;
    codigo: string;
    descripcion: string;
    abreviatura: string;
    fechaCarga: Date;
    departamento: Departamento;
}
