
import { Component } from '@angular/core';
import { NavController, IonicPage, ModalController, NavParams, ViewController, Platform, LoadingController } from 'ionic-angular';
import {NgForm} from '@angular/forms';
import {EmployeeTabsPage} from '../EmployeeView/employee-tabs/employee-tabs';
import {LoginServiceProvider} from '../../providers/login-service/login-service';


/**
 * Generated class for the PopupMessagesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-popup-messages',
  templateUrl: 'popup-messages.html',
})
export class PopupMessagesPage {

  ModalData: string;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, public platform: Platform) {
    console.log("PopupMessagesPage shows" + navParams.get('ModalData'));
    this.ModalData = navParams.get('ModalData');
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopupMessagesPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }


}
