import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WebSocketService } from '../web-socket.service'


@Component({
  selector: 'app-back-strength',
  templateUrl: './back-strength.component.html',
  styleUrls: ['./back-strength.component.css']
})
export class BackStrengthComponent implements OnInit {
  @Output() ifShowButton: EventEmitter<boolean> = new EventEmitter();
  showButton: boolean = false;

  private _backStrengthLeft: number;
  private _backStrengthRight: number;
  count = 0;
  timesRun = 0;

  //webSocket
  myJson: any = null;
  canReceiveMsg: boolean;
  runTimesLoop = 0;

  left: number;
  right: number;

  constructor(public ws: WebSocketService){
  }

  startProcess (msg: string, runTimes: number, timeInterval: number) {
    this.myJson = '';
    console.time("time");
    this.sendMsgInLoop(msg, timeInterval, runTimes)
    let interval_1 = setInterval(() => { 
      if(this.canReceiveMsg === true) {
        if(this.ws.receiveFlag === 1){
          this.ws.receiveFlag = 0;
          this.canReceiveMsg = false;
          this.myJson = this.ws.getJson();
        }
        // if(typeof(this.myJson) === "undefined") {
        //   // alert("undefined");
        //   console.log("undefined");
        //   return;
        // }
        if(this.myJson !== null){
          console.log(this.myJson.right);
          this._backStrengthLeft = this.myJson.left;
          this.popNumberLeft(this._backStrengthLeft);
          this._backStrengthRight = this.myJson.right;
          this.popNumberRight(this._backStrengthRight);
          this.myJson = null;
        }
        if(this.runTimesLoop > runTimes) {
          this.runTimesLoop = 0;
          clearInterval(interval_1);
          setTimeout(() => {
            this.showButton = true;
            this.ifShowButton.emit(this.showButton);
            console.timeEnd("time");        
          }, 1);
        }
      }
    }, 1);
    console.time("time");
  }

  sendMsgInLoop (msg: string, ms: number, runTimes: number) {
    setTimeout(()=> {
      this.ws.send(msg);
      this.canReceiveMsg = true;
      if(this.runTimesLoop++ < runTimes)
        this.sendMsgInLoop(msg, ms, runTimes);
    },ms);
  }
    
  // @Input()
  // set backStrengthLeft(backStrengthLeft: number) {
  //   this._backStrengthLeft = backStrengthLeft;
  //   // this._backStrengthRight = backStrength[1];
  //   this.popNumber(this._backStrengthLeft, this.left);
  // }

  // @Input()
  // set backStrengthRight(backStrengthRight: number) {
  //   this._backStrengthRight = backStrengthRight;
  //   // this._backStrengthRight = backStrength[1];
  //   this.popNumber(this._backStrengthRight, this.right);
  // }

  @Input()
  set appShowButton(appShowButton: boolean) {
    this.showButton = appShowButton;
    this.ifShowButton.emit(this.showButton);
    // console.log(this.showButton);
  }

  @Input()
  set isDetectBackStrength(selected_side: string) {
    if(selected_side === 'next') {
      setTimeout(() => {
        this.showButton = false;
        this.ifShowButton.emit(this.showButton);
      }, 2);
      this.startProcess('back_strength\r\n', 50 * 12, 20);
      // setTimeout(() => {
      //   this.showButton = true;
      //   this.ifShowButton.emit(this.showButton);
      // }, 2450);
      // this.count = 100;
      // let interval = setInterval(() => { 
      //   this.popNumber(0);
      //   this.timesRun++;
      //   if(this.timesRun === 200){
      //     clearInterval(interval);
      //     this.timesRun = 0;
      //   }
      // }, 10);
    }
    else if(selected_side === 'none') {

    }
    else if(selected_side === 'back') {

    }
  }

  //  Chart
  public barChartData:Array<any> = [
    {data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 8,    7, 6, 5, 4, 3, 2, 1, 2, 3, 4,   0, 0, 0, 0, 0, 0, 0, 0, 0, 0,   0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Left BackStrength'},
    {data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 8,    7, 6, 5, 4, 3, 2, 1, 2, 3, 4,   0, 0, 0, 0, 0, 0, 0, 0, 0, 0,   0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Right BackStrength'}
  ];

  public barChartLabels: string[] = [ ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ',  ' ']

  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true 
  }

  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;



    public popNumberLeft(newNum: number ){
      console.log("enter");
    // this.count += 0.5;
    // newNum = this.count * (0.5 + Math.random() * 1)// + Math.cos(this.count + 1.5)* 7.4 + Math.sin(this.count + 3) * 6
    let _lineChartData:Array<any> = new Array(this.barChartData.length);;
    for (let i = 0; i < this.barChartData.length - 1; i++) {
      _lineChartData[i] = {data: new Array(this.barChartData[i].data.length), label: this.barChartData[i].label};
      for (let j = 0; j < this.barChartData[i].data.length - 1; j++) {
        _lineChartData[i].data[j] = this.barChartData[i].data[j + 1]//Math.floor((Math.random() * 100) + 1);
      }
    }
    _lineChartData[0].data[this.barChartData[0].data.length - 1] = newNum;//Math.floor((Math.random() * 100) + 1);
    // this.barChartData = _lineChartData;

    let clone = JSON.parse(JSON.stringify(this.barChartData));
    clone[0].data = _lineChartData[0].data;
    this.barChartData = clone;
  }

    public popNumberRight(newNum: number ){
    // this.count += 0.5;
    // newNum = this.count * (0.5 + Math.random() * 1)// + Math.cos(this.count + 1.5)* 7.4 + Math.sin(this.count + 3) * 6
    let _lineChartData:Array<any> = new Array(this.barChartData.length);;
    for (let i = 1; i < this.barChartData.length; i++) {
      _lineChartData[i] = {data: new Array(this.barChartData[i].data.length), label: this.barChartData[i].label};
      for (let j = 0; j < this.barChartData[i].data.length - 1; j++) {
        _lineChartData[i].data[j] = this.barChartData[i].data[j + 1]//Math.floor((Math.random() * 100) + 1);
      }
    }
    _lineChartData[1].data[this.barChartData[1].data.length - 1] = newNum;//Math.floor((Math.random() * 100) + 1);
    let clone = JSON.parse(JSON.stringify(this.barChartData));
    clone[1].data = _lineChartData[1].data;
    this.barChartData = clone;
  }

  ngOnInit() {
    this.left = 0;
    this.right = 1;
  }

  /**
   * (My guess), for Angular to recongnize the change in the dataset
   * it has to change the dataset variable directly,
   * so one way around it, is to clone the data, change it and then
   * assign it;
   */

}


  // public popNumber(newNum: number, leftOrRight: number) {
  //   let _barChartData: Array<any> = new Array(this.barChartData.length);
  //   if(leftOrRight) {
  //     for (let i = 0; i < this.barChartData.length - 1; i++) {
  //       _barChartData[i] = {data: new Array(this.barChartData[i].data.length), label: this.barChartData[i].label};
  //       for (let j = 0; j < this.barChartData[i].data.length - 1; j++) {
  //         _barChartData[i].data[j] = this.barChartData[i].data[j + 1];
  //       }
  //     }
  //   }
  //   else {
  //     for (let i = 1; i < this.barChartData.length; i++) {
  //       _barChartData[i] = {data: new Array(this.barChartData[i].data.length), label: this.barChartData[i].label};
  //       for (let j = 0; j < this.barChartData[i].data.length - 1; j++) {
  //         _barChartData[i].data[j] = this.barChartData[i].data[j + 1];
  //       }
  //     }
  //   }
  //   _barChartData[leftOrRight].data[this.barChartData[leftOrRight].data.length - 1] = newNum;
  //   this.barChartData = _barChartData;
  // }