import { Provincia } from "./provincia";

export class Distrito {
    id: number;
    codigo: string;
    descripcion: string;
    abreviatura: string;
    provincia: Provincia;
    fechaCarga: Date;
}
