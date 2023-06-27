import { TablaAuxiliarDetalleId } from "./tabla-auxiliar-detalle-id";

export class TablaAuxiliarDetalle {
    tablaAuxiliarDetalleId: TablaAuxiliarDetalleId;
    nombre: string;
    abreviatura: string;
    valor: string;
    valor2: string;
    observacion: string;
    indHabilitado: boolean;
    idUsuarioCrea: number;
    fechaCrea: Date;
}
