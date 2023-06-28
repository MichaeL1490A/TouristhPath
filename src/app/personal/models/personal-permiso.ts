import { TablaAuxiliarDetalle } from "../../configuracion/models/tabla-auxiliar-detalle";

export class PersonalPermiso {
    id: number;
    motivo: TablaAuxiliarDetalle;
    observacion: string;
    fechaInicio: Date;
    fechaFin: Date;
    adjunto: string;
    adjuntoFile: File;
    adjuntoUrl: string;
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    blnHabilitado: boolean = true;
}
