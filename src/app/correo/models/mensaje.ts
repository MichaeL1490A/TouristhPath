export class Mensaje{

    id: number;
	fechaEnvio: Date;
	idUsuarioCrea: number;
	receptores: string = '';
	asunto: string = '';
	mensaje: string = '';
	relacionados: string = '';
}
