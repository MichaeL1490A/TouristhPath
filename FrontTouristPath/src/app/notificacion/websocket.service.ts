import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  client: any;
  urlEndPoint: string =  environment.apiURL + 'api/websocket-server/tevo-websocket';
  //urlEndPoint: string =   'http:172.16.2.44:9003/tevo-websocket';
  constructor() { }

  conexion(){
    this.client = new Client();

    this.client.webSocketFactory = () =>{
      return new SockJS(this.urlEndPoint);
    }

    (this.client as Client).onConnect = () =>{

    }

    (this.client as Client).activate();
  }

  actualizarNotificacion(codigo: any){
    (this.client as Client).publish({destination: `/app/publish`, body: codigo});
  }

}
