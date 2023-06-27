import { HttpResponse } from "@angular/common/http";
import { Mensajes } from "./mensajes";
import { saveAs } from 'file-saver';

export class FuncionesComunes {

    public static romanize(num: any) {
        if (!+num) return false;
        let digits = String(+num).split('');
        let key = ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM',
            '', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC',
            '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
        let roman = '', i = 3;
        while (i--) roman = (key[+(digits.pop() || '') + (i * 10)] || '') + roman;
        return Array(+digits.join('') + 1).join('M') + roman;
    }

    public static validateEmail(email: string): boolean {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    public static obtenerEdad(fechaNacimiento: Date): number {
        let hoy: Date = new Date();
        let fechaNac: Date = new Date(fechaNacimiento);
        let edad: number = hoy.getFullYear() - fechaNac.getFullYear();
        let mesDiff: number = hoy.getMonth() - fechaNac.getMonth();
        if (mesDiff < 0 || (mesDiff === 0 && hoy.getDate() < fechaNac.getDate())) {
            edad--;
        }
        return edad;
    }

    public static filtrosToString(filtros: any): string {
        let f: string = '';
        for (let k in filtros.filters) {
            f += `&${k}=${filtros.filters[k].value}`;
        }
        if (f.length > 0) f += `&`;
        return f;
    }

    public static getFechaFormateadaPrime(date: Date): Date {
        if(!date) return null;
        if (date.toString().includes('00:00:00')) {
            return date;
        } else {
            return new Date(date + ' 00:00:00');
        }
    }

    public static getFechaHoraFormateadaPrime(date: Date): Date {
        if(!date) return null;
        return new Date(date.toString().replace('T', ' ').replace('0+00:00', ''))
    }

    public static multiselectToString(ev: any): string {
        return ev.value.map(e => e.id).join();
    }

    public static multiselectAuxiliarToString(ev: any): string {
        return ev?.value?.map(e => e?.tablaAuxiliarDetalleId?.id).join();
    }

    public static calendarRangeToString(rangoFechas: Date[], nombreFechaFinal: string, datePipe: any) {
        if(rangoFechas==null) return '';
        let fechaInicial = null
        if (rangoFechas[0] == null) fechaInicial = ''
        else fechaInicial = datePipe.transform(rangoFechas[0], "dd/MM/yyyy");
        let fechaFinal = null
        if (rangoFechas[1] == null) fechaFinal = ''
        else fechaFinal = datePipe.transform(rangoFechas[1], "dd/MM/yyyy");


        let filtroStringFechas = fechaInicial + '&' + nombreFechaFinal + '=' + fechaFinal
        return filtroStringFechas;
    }
    public static bindarTabla(objeto: any, atributo: string, lista: any[]) {
        objeto[atributo] = objeto[atributo] ? lista.find(ti => ti.id == objeto[atributo].id) : objeto[atributo];
    }

    public static bindarAuxiliar(objeto: any, atributo: string, listaAuxiliar: any[]) {
        objeto[atributo] = objeto[atributo] ? listaAuxiliar.find(ti => ti.tablaAuxiliarDetalleId.id == objeto[atributo].tablaAuxiliarDetalleId.id) : objeto[atributo];
    }

    public static valida(campos: any[], messageService: any): boolean {
        let valida: boolean = true;

        for (let o of campos) {
            if (o.tipo == 'string') {
                if (!o.valor || (o.valor as string).trim().length == 0) {
                    messageService.add({ severity: 'warn', summary: Mensajes.tituloFaltanDatos, detail: `Debe ingresar ${o.nombre}.` });
                    valida = false;
                    break;
                }
            } else if (o.tipo == 'number') {
                if (o.valor == null || o.valor == undefined) {
                    messageService.add({ severity: 'warn', summary: Mensajes.tituloFaltanDatos, detail: `Debe ingresar ${o.nombre}.` });
                    valida = false;
                    break;
                }
            } else if (o.tipo == 'object') {
                if (o.valor == null || o.valor == undefined) {
                    messageService.add({ severity: 'warn', summary: Mensajes.tituloFaltanDatos, detail: `Debe ingresar ${o.nombre}.` });
                    valida = false;
                    break;
                }
            }
            //TO DO: validacion tipo date
        }

        return valida;
    };

    public static descargarArchivoBlob(res: HttpResponse<Blob>){
        const nombreArchivo: string = res?.headers?.get('content-disposition').replace('attachment; filename=', '').replace(/%20/g, " ");
        saveAs(res?.body, nombreArchivo);
    }

    public static descargarArchivo(nombreArchivo: string, file: File) {
        file.arrayBuffer().then((arrayBuffer) => {
            let blob = new Blob([new Uint8Array(arrayBuffer)], {type: file.type });
            saveAs(blob, nombreArchivo);
        });
    }

    public static generateUUID(): string {
        let d = new Date().getTime();
        let d2 = (performance && performance.now && (performance.now() * 1000)) || 0;
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
          let r = Math.random() * 16;
          if (d > 0) {
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
          } else {
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
          }
          return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
        });
    };

    public static prepararArchivos(target: any, campos: string[], numeroRuta: number, listaArchivos: File[] = [], listaAcciones: any[] = []):any {
        let nombre: string = null
        campos.forEach(str =>{
            if(target[str] != target[str+'Aux']){
              if(target[str+'File']==null || target[str+'File']==undefined){
                listaAcciones.push({numeroRuta: numeroRuta, accion: 'eliminar', nombreArchivo: target[str+'Aux']});
                listaArchivos.push(null);
              }
              else if(target[str] && target[str].length>0){
                let splits = target[str].split('.')
                nombre = target[str+'Aux']??(str + '_' + this.generateUUID() + '.' + splits[splits.length-1])
                listaAcciones.push({numeroRuta: numeroRuta, accion: 'actualizar', nombreArchivo: nombre});
                listaArchivos.push(target[str+'File']);
                target[str] = nombre
              }
            }
        })
        return {listaArchivos: listaArchivos, listaAcciones: listaAcciones}
    }

    //deprecated
    /* public static prepararArchivosArray(target: any[], campos: string[], numeroRuta: number, listaArchivos: File[] = [], listaAcciones: any[] = []):any {
        let nombre: string = null
        campos.forEach(str =>{
            target.forEach(doc=>{
              if(doc[str] != doc[str+'Aux']){
                if(doc[str+'File']==null || doc[str+'File']==undefined){
                  listaAcciones.push({numeroRuta: numeroRuta, accion: 'eliminar', nombreArchivo: doc[str+'Aux']});
                  listaArchivos.push(null);
                }
                else if(doc[str] && doc[str].length>0){
                  let splits = doc[str].split('.')
                  nombre = doc[str+'Aux']??(str + '_' + this.generateUUID() + '.' + splits[splits.length-1])
                  listaAcciones.push({numeroRuta: numeroRuta, accion: 'actualizar', nombreArchivo: nombre});
                  listaArchivos.push(doc[str+'File']);
                  doc[str] = nombre
                }
              }
            })
        })
        return {listaArchivos: listaArchivos, listaAcciones: listaAcciones}
    } */

    public static prepararArchivosArrayCompare(oldArray: any[], newArray: any[], campos: string[], numeroRuta: number, listaArchivos: File[] = [], listaAcciones: any[] = []):any {
        let nombre: string
        campos.forEach(str =>{
            oldArray.forEach(oe=>{
                let ne = newArray.find(ne=>ne.id == oe.id)
                if(ne == undefined && oe[str] && oe[str].length > 0){
                    listaAcciones.push({numeroRuta: numeroRuta, accion: 'eliminar', nombreArchivo: oe[str]});
                    listaArchivos.push(null);
                }
                else if(ne != undefined && oe[str] != ne[str]){
                    if(!ne[str + 'File']){
                        listaAcciones.push({numeroRuta: numeroRuta, accion: 'eliminar', nombreArchivo: oe[str]});
                        listaArchivos.push(null);
                    }
                    else if(ne[str] && ne[str].length > 0){
                        let splits: string[] = ne[str].split('.')
                        nombre = oe[str]??(str + '_' + this.generateUUID() + '.' + splits[splits.length-1])
                        listaAcciones.push({numeroRuta: numeroRuta, accion: 'actualizar', nombreArchivo: nombre});
                        listaArchivos.push(ne[str + 'File']);
                        ne[str] = nombre
                    }
                }
            })
            newArray.forEach(ne=>{
                if(ne.id == 0 && ne[str + 'File']){
                    let splits: string[] = ne[str].split('.')
                    nombre = str + '_' + this.generateUUID() + '.' + splits[splits.length-1]
                    listaAcciones.push({numeroRuta: numeroRuta, accion: 'actualizar', nombreArchivo: nombre});
                    listaArchivos.push(ne[str + 'File']);
                    ne[str] = nombre
                }
            })
        })
        return {listaArchivos: listaArchivos, listaAcciones: listaAcciones}
    }
}