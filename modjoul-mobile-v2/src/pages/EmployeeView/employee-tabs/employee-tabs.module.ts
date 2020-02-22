import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmployeeTabsPage } from './employee-tabs';

@NgModule({
  declarations: [
    EmployeeTabsPage,
  ],
  imports: [
    IonicPageModule.forChild(EmployeeTabsPage),
  ]
})
export class EmployeeTabsPageModule {}
