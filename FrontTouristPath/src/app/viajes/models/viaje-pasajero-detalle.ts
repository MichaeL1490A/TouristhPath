import { TablaAuxiliarDetalle } from "src/app/configuracion/models/tabla-auxiliar-detalle";
import { ViajePasajero } from "./viaje-pasajero";

export class ViajePasajeroDetalle{
	id: number;

	nombresApellidos: string;
	sexo: TablaAuxiliarDetalle;
	edad: number;
	correo: string;
	boleto: TablaAuxiliarDetalle;
}