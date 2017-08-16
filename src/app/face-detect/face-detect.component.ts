import { Component, OnInit, AfterViewInit, ViewChild, Input, OnChanges, Output, EventEmitter, AfterViewChecked } from '@angular/core';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from "rxjs/Observable";
import { toPromise } from "rxjs/operator/toPromise";

@Component({
  selector: 'app-face-detect',
  templateUrl: './face-detect.component.html',
  styleUrls: ['./face-detect.component.css']
})
export class FaceDetectComponent implements OnInit, AfterViewInit, AfterViewChecked{
  @ViewChild('videoplayer') videoPlayer: any;
  @ViewChild('canvas') canvas: any;
  public showVideo: any = false;  

  context: any;
  comment: string;
  identifier: string;
  longitude: number;
  latitude: number;
  usedTime = 0;
  state = '等待操作';
  viewCheck: boolean;

  faceMatchCount = 0;
  lastFaceMatch;
  ifPeopleShow = 0;
  itemPath = '';
  
  showFacename = '';


  color = 'primary';
  mode = 'determinate';
  value = 0;  

  timesRun = 0;

  @Input() width: number;
  @Input() height: number;
  @Input()
  set ifSearchFace(selected_side: string) {
    if(selected_side === 'back') {
      this.searchFace();
    }
    else if(selected_side === 'none') {
      this.showFacename = 'null';
      this.state = '等待操作';
    }
  }
  @Output() ifShowButton: EventEmitter<boolean> = new EventEmitter();
  showButton: boolean = false;

  constructor(private http: Http) { }

  ngOnInit() {
    this.width = 800;
    this.height = 520;
    this.showVideo = false;
    // setTimeout(() => {
    //   this.faceMatchCount = 0;
    //   this.searchFace();
    // }, 1000);
  }

  ngAfterViewInit() {
    // Get current geolocation

    // if(this.showVideo ==  true) {
      this.context = this.canvas.nativeElement.getContext('2d');
      console.log(this.context);

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia)  {
        navigator.mediaDevices.getUserMedia({ video: true })
                            .then(stream => {
                              this.videoPlayer.nativeElement.src = window.URL.createObjectURL(stream);
                              this.videoPlayer.nativeElement.play();
                            });
      }
      this.searchFace();
  }

  ngAfterViewChecked(){
    if(this.viewCheck === false)
    {
      this.context = this.canvas.nativeElement.getContext('2d');
      console.log(this.context);

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia)  {
        navigator.mediaDevices.getUserMedia({ video: true })
                            .then(stream => {
                              this.videoPlayer.nativeElement.src = window.URL.createObjectURL(stream);
                              this.videoPlayer.nativeElement.play();
                            });
      }
      this.viewCheck = true;
      this.searchFace();
    }
  }

  capture(): any {
    this.context.drawImage(this.videoPlayer.nativeElement, 180, 110, 440, 300, 0, 0, 440, 300);
    return this.canvas.nativeElement.toDataURL('image/jpeg',0.5);
  }

  searchFace(): any {
    if(this.faceMatchCount === 0) {
      this.showFacename = 'null';
      this.mode = 'indeterminate';
      // this.value = 100;
      this.state = '进行中';
      this.showButton = false;
      setTimeout(() => {
        this.ifShowButton.emit(this.showButton);
      }, 1);
    }

    if(this.faceMatchCount < 2) {
      let imgData: any = this.capture();
      imgData = imgData.replace('data:image/jpeg;base64,', '');
      imgData = imgData.replace(/\+/g, '%2B');
      imgData = imgData.replace(/\//g, '%2F');

      let detect_body = 'api_key=Zjym4i4c_6IlXFG3y-KR6SpKTCeIwmH8&api_secret=Mi8_qW0fKyMvpRFcg4EPEAJsK_1dmPFF&image_base64=' + String(imgData) + '&outer_id=First';//smiling,headpose,blur,eyestatus,emotion,
      var headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      let options = new RequestOptions({ headers: headers });

      this.http.post("https://api-cn.faceplusplus.com/facepp/v3/search",detect_body,options)
              .toPromise()
              .then((res) => {
                {console.log(res);
                this.judgeFace(res);
                setTimeout(() => {
                  this.searchFace();
                }, 500);
                }
              })
              .catch(() => {
                  setTimeout(() => {
                   this.searchFace();
                }, 250);}); 
    }
    else{
      console.log("Been Here, using time: " + this.usedTime);
      this.state = '识别完毕';
      this.value = 0;
      // document.getElementById("search").classList.add('anim_fade_image'); 
      // document.getElementById("search").classList.remove('anim_fade_image');  
      this.itemPath = "/assets/" + this.showFacename + ".PNG";
      this.ifPeopleShow = 1;
      this.ifPeopleShow = 1;
      this.usedTime = 0;
      this.faceMatchCount = 0;
      this.showButton = true;
      this.ifShowButton.emit(this.showButton);
      //this.waitBar = 0;
    }
    this.value = 0;
  }

  private handleSearchError(error: any): Promise<any> {
    // this.color = 'accent';
    console.error('An error occured', error);
    setTimeout(() => {
      this.searchFace();
    }, 1000);
    return Promise.reject(error.message || error);

    
  }

  judgeFace(res: any) {
    if(typeof(res.json().results) === "undefined") {
      // alert("undefined");
      return;
    }
    else if(res.json().results[0].user_id === "") {
      console.log("No User");
      this.state = '请靠近摄像头';
      //this.itemPath = "/assets/null.png";
      this.showFacename = 'null';
      this.faceMatchCount = 0;
      this.usedTime = 0;
    }
    else if(this.faceMatchCount === 0){
      this.state = '已检测到目标';
      this.lastFaceMatch = res.json().results[0].user_id;
      this.faceMatchCount++;
      this.usedTime += res.json().time_used;
      console.log("+0");
    }
    else {
      if(res.json().results[0].user_id === this.lastFaceMatch){
        this.showFacename = res.json().results[0].user_id;
        this.faceMatchCount++;
        this.value = 0;
        this.mode = 'determinate';
        this.usedTime += res.json().time_used;
        console.log("+1");
      }
      else {
        // this.itemPath = "/assets/null.png";
        this.faceMatchCount = 0;
        this.usedTime = 0;
      }
    }
    this.lastFaceMatch = res.json().results[0].user_id; 
  }
}
