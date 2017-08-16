import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WebSocketService } from '../web-socket.service'


@Component({
  selector: 'app-heartrate',
  templateUrl: './heartrate.component.html',
  styleUrls: ['./heartrate.component.css']
})
export class HeartrateComponent implements OnInit {
  @Input() width: number;
  @Input() height: number;
  @Output() ifShowButton: EventEmitter<boolean> = new EventEmitter();
  showButton: boolean = false;

  myJson: any;

  private _hrRed: number;
  count = 0;
  timesRun = 0;

  constructor(public ws: WebSocketService) {
   }

   @Input()
   set hrRed(hrRed: number) {
     this._hrRed = hrRed;
     this.popNumber(this._hrRed);
   }

   @Input()
   set isDetectHeartrate(selected_side: string) {
    if(selected_side === 'next') {
      setTimeout(() => {
        this.showButton = false;
        this.ifShowButton.emit(this.showButton);
      }, 2);
      setTimeout(() => {
        this.showButton = true;
        this.ifShowButton.emit(this.showButton);
      }, 18000);
      this.ws.send('heartrate_left\r\n');
      let interval_1 = setInterval(() => { 
        
        if(this.ws.receiveFlag === 1){
            this.ws.receiveFlag = 0;
            this.myJson = this.ws.getJson();
        }
        if(typeof(this.myJson.heartrate) === 'undefined') {
        //   // alert("undefined");
        //   console.log("undefined");
          return;
        }
        if(this.myJson !== null){
          // console.log(this.myJson.right);
          if(this.myJson.heartrate === null) {
            this.myJson = null;
            return;
          }
          this._hrRed = this.myJson.heartrate;
          console.log(this._hrRed);
          this.popNumber(this._hrRed);
          this.myJson = null;
        }
      }, 5);
    }
    else if(selected_side === 'none') {
    }
   }

  ngOnInit() {
    this.height = 640;
    this.width = 480;
    // let interval = setInterval(() => { 
    //   this.popNumber(0);
    //   this.timesRun++;
    //   if(this.timesRun === 100){
    //     clearInterval(interval);
    //     this.timesRun = 0;
    //   }
    // }, 50);
  }


  public popNumber(newNum: number ){
    this.count += 0.5;
    newNum = this.count * (0.5 + Math.random() * 1)// + Math.cos(this.count + 1.5)* 7.4 + Math.sin(this.count + 3) * 6
    let _lineChartData:Array<any> = new Array(this.lineChartData.length);
    for (let i = 0; i < this.lineChartData.length; i++) {
      _lineChartData[i] = {data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label};
      for (let j = 0; j < this.lineChartData[i].data.length - 1; j++) {
        _lineChartData[i].data[j] = this.lineChartData[i].data[j + 1]//Math.floor((Math.random() * 100) + 1);
      }
    }
    _lineChartData[0].data[this.lineChartData[0].data.length - 1] = newNum;//Math.floor((Math.random() * 100) + 1);
    this.lineChartData = _lineChartData;
  }

  // lineChart
  lineChartData:Array<any> = [
    {data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'HR'}
  ];

  lineChartLabels: Array<any> = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];

  public lineChartOptions: any = {
    legend: {
            display: false,
            labels: {
                fontColor: 'rgb(255, 99, 132)'
            }
        },
    layout: {
      padding: {
          left: 20,
          right: 20,
          top: 20,
          bottom: 20
      }
    },
    scales: {
      xAxes: [{
          gridLines: {
              display:false
          }
      }],
      yAxes: [{
          gridLines: {
              display:false
          }   
      }]
    },
    animation: {
      duration: 100,
      easing: 'linear'
    }
  };

  public lineChartColors: Array<any> = [
    {
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255,99,132,1)',
      pointBackgroundColor: 'rgba(255,99,132,1)',
      // pointBorderColor: "#fff",
      pointRadius: 0,
      borderWidth: 3,
      fill: true,
      showLine: true,
      gridLineColor: "#000",
      scaleShowGridLines : false,  
    }
  ]

  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';
}


      // this.count = 100;
      // let interval = setInterval(() => { 
      //   this.popNumber(0);
      //   this.timesRun++;
      //   if(this.timesRun === 200){
      //     clearInterval(interval);
      //     this.timesRun = 0;
      //   }
      // }, 10);