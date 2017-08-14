import { Component, OnInit } from '@angular/core';
import { WebSocketService } from './web-socket.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    WebSocketService
  ]
})
export class AppComponent implements OnInit{
  lastJson: JSON;
  myJson: any;
  idIdle = true;
  runTimesLoop = 0;
  receiveMsgFlag = 0;
  canReceiveMsg: boolean;
  hrRed = 0;
  selected_side : string = 'none';

  status: string;
  showButton: boolean;

  choseSide(side: string) {
    this.selected_side = side;
    if(this.selected_side === 'next') {
      if(this.status === 'face_detect') {
        this.status = 'heartrate';
        this.selected_side = 'none';
      }
      else if(this.status === 'heartrate') {
        this.selected_side = 'none'
        this.ws.send('heartrate_left\r\n');
        // this.canReceiveMsg = true;
        let interval_1 = setInterval(() => {
          if(this.ws.receiveFlag === 1){
            this.ws.receiveFlag = 0;
            this.myJson = this.ws.getJson();
          }
          if(typeof(this.myJson) !== "undefined"){
            console.log(this.myJson);
            this.hrRed = this.myJson.heartrate;
            this.myJson = null;
          }
          if(this.runTimesLoop > 10000) {
            this.runTimesLoop = 0;
            clearInterval(interval_1);
          }
        }, 5);
      }
    }
    else if(this.selected_side === 'back') {
      if(this.status === 'heartrate') {
        this.status = 'face_detect';
        this.selected_side = 'none';
      }
    }
  }

  ifShowButton(showButton: boolean) {
    this.showButton = showButton;
  }

  constructor(private ws: WebSocketService){
  }

  openSocket() {
    this.ws.init();
  }

  ngOnInit () {
    this.status = 'heartrate';
    this.showButton = true;
    this.openSocket();
    
  }

  heartrate_detech(){
    this.showButton = false;
    this.selected_side = 'none'
        this.ws.send('heartrate_left\r\n');
        // this.canReceiveMsg = true;
        let interval_1 = setInterval(() => {
          if(this.ws.receiveFlag === 1){
            this.ws.receiveFlag = 0;
            this.myJson = this.ws.getJson();
          }
          if(typeof(this.myJson) !== "undefined"){
            console.log(this.myJson);
            this.hrRed = -this.myJson.heartrate;
            // this.myJson = null;
          }
          if(this.runTimesLoop > 1000) {
            this.runTimesLoop = 0;
            this.showButton = true;
            clearInterval(interval_1);
          }
        }, 1);
  }

  startProcess (msg: string, runTimes: number, timeInterval: number) {
    this.myJson = '';
    this.sendMsgInLoop(msg, timeInterval, runTimes);
    let interval_1 = setInterval(() => { 
      if(this.canReceiveMsg === true) {
        if(this.ws.receiveFlag === 1){
          this.ws.receiveFlag = 0;
          this.canReceiveMsg = false;
          this.myJson = this.ws.getJson();
        }
        if(this.myJson !== null){
          console.log(this.myJson);
          this.hrRed = this.myJson.weight;
          this.myJson = null;
        }
        if(this.runTimesLoop > runTimes) {
          this.runTimesLoop = 0;
          clearInterval(interval_1);
        }
      }
    }, 1);
  }

  sendMsgInLoop (msg: string, ms: number, runTimes: number) {
    setTimeout(()=> {
      this.ws.send(msg);
      this.canReceiveMsg = true;
      if(this.runTimesLoop++ < runTimes)
        this.sendMsgInLoop(msg, ms, runTimes);
    },ms);
  }
}