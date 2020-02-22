
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';


import { CalendarModal, CalendarModalOptions, DayConfig, CalendarResult, CalendarComponentOptions } from "ion2-calendar";

import {NgForm, FormBuilder,FormGroup,Validators,FormControl} from '@angular/forms';


// mobiscroll.settings = {
//   theme: 'ios-dark'
// };

@Component({
    selector: 'dashboard-calendar',
    templateUrl: 'dashboard-calendar.html'
  })
  
  export class DashBoardCalendar {
  
    calendarOneWeek: Date;
  calendarTwoWeek: Date;
  calendarThreeWeek: Date;
  
    ModalData :string = "Calandar example";
    date: string;
    type: 'string';
    dateRange: { from: string; to: string; };
  
   constructor() {
     console.log("Calendar in dash board");
   }
   onChange($event) {
    console.log($event);
  }
  optionsRange: CalendarComponentOptions = {
    pickMode: 'single',
    //canBackwardsSelected: true,
  };
  
  withAdditionalEvent(event: any, addition: string) {
    console.log(addition); // prints 'myAddition'
    console.log(event)
  }
  
  }
  