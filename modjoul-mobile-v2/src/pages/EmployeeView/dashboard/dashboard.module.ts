import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DashboardPage } from './dashboard';
import {DashBoardCalendar} from './dashboard-calendar';
import { CalendarModule } from "ion2-calendar";
import {PipesModule} from '../../../pipes/pipes.module';

//import { MbscModule } from '@mobiscroll/angular';


@NgModule({ 
  declarations: [
    DashboardPage,
    DashBoardCalendar
  ],
  imports: [
    IonicPageModule.forChild(DashboardPage),
    CalendarModule,
    PipesModule,
    //MbscModule
  ],
})
export class DashboardPageModule {}
