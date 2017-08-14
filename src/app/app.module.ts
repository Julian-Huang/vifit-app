import { BrowserModule }           from '@angular/platform-browser';
import { NgModule }                from '@angular/core';
import { ChartsModule }            from 'ng2-charts/ng2-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdCardModule }            from '@angular/material';
import { MdProgressBarModule }     from '@angular/material';
import { MdIconModule }            from '@angular/material';
import { MdProgressSpinnerModule } from '@angular/material';
import { HttpModule } from '@angular/http';


import 'hammerjs'

import { AppComponent }         from './app.component';
import { FaceDetectComponent }  from './face-detect/face-detect.component';
import { LeapButtonComponent }  from './leap-button/leap-button.component';
import { HeartrateComponent }   from './heartrate/heartrate.component';

@NgModule({
  declarations: [
    AppComponent,
    FaceDetectComponent,
    LeapButtonComponent,
    HeartrateComponent
  ],
  imports: [
    BrowserModule,
    ChartsModule,
    BrowserAnimationsModule,
    MdCardModule,
    MdProgressBarModule,
    MdIconModule,
    HttpModule,
    MdProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
