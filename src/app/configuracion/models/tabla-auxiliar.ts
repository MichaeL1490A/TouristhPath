import { TablaAuxiliarDetalle } from "./tabla-auxiliar-detalle";

export class TablaAuxiliar {
    codTablaAuxiliar: string;
    nombre: string;
    observacion: string;
    detalleAuxiliar: TablaAuxiliarDetalle[];
    indEdicion: number;
    idUsuarioCrea: string;
    fechaCrea: Date;
}
