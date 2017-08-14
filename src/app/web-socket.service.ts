import { Injectable } from '@angular/core';

@Injectable()
export class WebSocketService {

  outJson: JSON;
  mySocket: WebSocket;
  receiveFlag = 0;

  send(msg: string) {
    this.mySocket.send(msg);
  }

  init() {
    this.mySocket = new WebSocket('ws://192.168.1.7:6432');
    this.mySocket.binaryType = 'arraybuffer';
    this.mySocket.onopen = function (evt: any) {
      console.log('open Success')
    }
    this.mySocket.onmessage = (msg) => { this.wsOnmessage(msg) };
  }

  getJson(): JSON {
    return this.outJson;
  }

  wsOnmessage(msg: any){
    if (msg.data instanceof ArrayBuffer) {
      var gbuf = new Uint8Array(msg.data, 0);
      var array = Array.from(gbuf);
      var out, i, len, c;
      var char2, char3;
      out = '';
      len = array.length;
      i = 0;
      while(i < len) {
        c = array[i++];
        switch (c >> 4) {
          case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
            out += String.fromCharCode(c);
            break;
          case 12: case 13: 
          char2 = array[i++];
          out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
          break;
          case 14:
            char2 = array[i++];
            char3 = array[i++];
            out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
            break;
        }
      }
      this.outJson = JSON.parse(out);
      this.receiveFlag = 1;
      // console.log(this.outJson);
    }
  }

  constructor() { }

}
