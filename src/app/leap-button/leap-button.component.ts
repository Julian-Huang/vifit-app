import { Component, OnInit, Output, EventEmitter, AfterViewChecked } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MdIconRegistry} from '@angular/material';

import { LeapmotionService } from './leapmotion.service'

@Component({
  selector: 'app-leap-button',
  templateUrl: './leap-button.component.html',
  styleUrls: ['./leap-button.component.css'],
  providers: [
    LeapmotionService
  ]
})
export class LeapButtonComponent implements OnInit, AfterViewChecked {
  @Output() selected_side: EventEmitter<string> = new EventEmitter();
  selected_side_msg: string = 'none';

  extendedFingers = 0;
  hand_click = false;
  hand_position = 0;
  

  color="$mat-light-blue";
  mode="buffer"
  value=0;
  bufferValue=100;
  width="50em";
  full_bar = false;
  hasShadow = false;
  tip = 'gesture';

  constructor(private leap: LeapmotionService, iconRegistry: MdIconRegistry, sanitizer: DomSanitizer) {
    this.leapLoop(leap);
   }

  leapLoop(leap: LeapmotionService) {
    leap.loop(( frame: any) => {
      this.extendedFingers = 0;
      for (let f = 0; f < frame.fingers.length; f++){
        const finger = frame.fingers[f];
        if (finger.extended) {
          this.extendedFingers++;
        }
      }
      if(this.hand_click === false) {
        if((this.extendedFingers > 1) && (this.extendedFingers < 5)) {
          setTimeout(()=> {
            this.judgeGesture(frame);
          },20);
        }
      }
      else {
        this.judgeGesture(frame);
      }
    })
  }

  judgeGesture(frame: any) {
    if((this.extendedFingers > 1) && (this.extendedFingers < 5)){
      this.hand_click = true;
      this.getHandPosition(frame);
      this.full_bar = true;
      this.hasShadow = true;
    }
    else {
      if(this.hand_click === true) {
        if (this.hand_position > 140){
          this.selected_side_msg = 'next';
          this.selected_side.emit(this.selected_side_msg);
          this.tip = 'isNext';
          this.value = 100;
          this.hand_click = false;
          setTimeout(() => {
            this.value = 0;
            this.tip = 'gesture';
          }, 200);
        }
        else if (this.hand_position < -120){
          this.selected_side_msg = 'back';
          this.selected_side.emit(this.selected_side_msg);
          this.tip = 'isBack';
          this.value = 0;
          this.bufferValue = 0;
          this.hand_click = false;
          setTimeout(() => {
            this.selected_side_msg = 'none';
            this.selected_side.emit(this.selected_side_msg);
            this.bufferValue = 100;
            this.tip = 'gesture';
          }, 1200);
        }
        else {
          this.selected_side_msg = 'none-0';
          this.selected_side.emit(this.selected_side_msg);
          this.tip = 'gesture';
          this.value = 0;
          this.bufferValue = 100;
          this.hand_click = false;
        }
      }
      this.full_bar = false;
      this.hasShadow = false;
      this.color = "primary";
    }
  }

   getHandPosition(frame: any) {
    if(frame.pointable.length > 0) {
    var pointable1 = frame.pointables[1];
    var pointable2 = frame.pointables[2];
    this.hand_position = (pointable1.tipPosition[0] + pointable2.tipPosition[0]) / 1.2 + 20;
    if(this.hand_position >= 0) {
      this.tip = 'next';
      this.color = "primary";
      this.value = this.hand_position;
      this.bufferValue = 100;
    }
    else if(this.hand_position < 0) {
      this.tip = 'back'
      this.color = "warn";
      this.bufferValue = 100 + this.hand_position;
      this.value = 0;
    }
    if(this.hand_position > 180)
      this.hand_position = 180;
    else if(this.hand_position < -180)
      this.hand_position = -180;
    }
  }

  ngAfterViewChecked(){
    setTimeout(() => {
      this.selected_side_msg = "none";
      this.selected_side.emit(this.selected_side_msg);
    }, 10);
  }

  ngOnInit() {
  }

}
