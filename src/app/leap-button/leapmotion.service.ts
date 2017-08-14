import { Injectable } from '@angular/core'
declare var require: any;
const Leap = require('leapjs');

@Injectable()
export class LeapmotionService {
  private Leap = Leap;

  loop(options: any, ...args: any[]) {
    return this.Leap.loop(options, ...args);
  }
}