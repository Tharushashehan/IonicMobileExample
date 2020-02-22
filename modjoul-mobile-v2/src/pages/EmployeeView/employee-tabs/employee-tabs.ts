import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

/**
 * Generated class for the EmployeeTabsPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-employee-tabs',
  templateUrl: 'employee-tabs.html'
})
export class EmployeeTabsPage {

  dashboardRoot = 'DashboardPage'
  goalsRoot = 'GoalsPage'
  alertsRoot = 'AlertsPage'
  sharingRoot = 'SharingPage'
  moreRoot = 'MorePage'


  constructor(public navCtrl: NavController) {}

}
