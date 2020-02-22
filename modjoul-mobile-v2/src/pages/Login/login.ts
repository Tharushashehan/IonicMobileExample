import { Component } from '@angular/core';
import { NavController, ModalController, NavParams, ViewController, Platform, LoadingController } from 'ionic-angular';
import {NgForm} from '@angular/forms';
import {EmployeeTabsPage} from '../EmployeeView/employee-tabs/employee-tabs';
import {LoginServiceProvider} from '../../providers/login-service/login-service';
import {PopupMessagesPage} from '../../pages/popup-messages/popup-messages';
import { Storage } from '@ionic/storage';
import { LoginModel } from '../../Utilities/model/login-model/login-model';
import {WifiHotspotServiceProvider} from '../../providers/wifi-hotspot-service/wifi-hotspot-service';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {

  Login = {};
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';

  constructor(public navCtrl: NavController, private LoginService:LoginServiceProvider, public modalCtrl: ModalController, public loadingCtrl: LoadingController, private storage: Storage, private WifiHotspotService: WifiHotspotServiceProvider) {
  
  }

  hideShowPassword():void {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  loading():void{
    let load = this.loadingCtrl.create({
      spinner: 'hide',
      content:`
      <ion-item no-lines style="background-color :transparent">
      <img src="assets/gif/ajax-loader.gif" item-start >
      <ion-label item-end color="primary" stacked> Processing </ion-label>
      </ion-item>`,
      cssClass: 'loading-class',
      duration: 3000
    });
    load.present();
  }

  logForm(f: NgForm):void {
    try{
      if(!this.Login["email"] || this.Login["email"] === ""){
        this.presentProfileModal("Please enter a valid email");
    }else{
      this.loading();
      this.LoginService.LoginService(this.Login).subscribe(
        (data: LoginModel) => {
          if(data.token){
            this.storage.set('accessToken', data.token.toString());
            this.storage.set('UserObject', JSON.stringify(data.user));
            this.storage.get('accessToken').then((val) => {
              console.log('Your accessToken is', val);
            });

            this.storage.get('UserObject').then((data) => {
              if (data != null) {console.log(JSON.parse(data).firstName);}
              else {console.log("Do something");}
            });
            this.WifiHotspotService.getWifiNetworksList(data.user.orgId, data.user.userId).subscribe(
              (data: Response) => {                          
                this.storage.set('SavedNetworks', JSON.stringify(data));
                console.log(this.storage.get('SavedNetworks'));
            });
            this.navCtrl.push(EmployeeTabsPage);
          }else{
            console.log("Something went wrong"); 
            this.presentProfileModal("Something went wrong!");
          }
        },(error: Error) => {
          console.log(error); 
          this.presentProfileModal(error.toString());
      },()=>{
        console.log("Complete");
      });
    }
    }catch(e){
      console.log(e);
    }   
  }

  presentProfileModal(data: string):void {
    let profileModal = this.modalCtrl.create(PopupMessagesPage, { ModalData: data });
    profileModal.present();
  }

  forgotPassWord():void{
    try{
      if(!this.Login["email"] || this.Login["email"] === ""){
        this.presentProfileModal("Please enter a valid email");
      }else{
        this.LoginService.forgotPasswordService(this.Login).subscribe(
          (data: LoginModel) => {
            if(data.token){
              this.navCtrl.push(EmployeeTabsPage);
            }else{
              console.log("Something went wrong"); 
              this.presentProfileModal("Something went wrong!");
            }
          },(error: Error) => {
            console.log(error); 
            this.presentProfileModal(error.toString());
        },()=>{
          console.log("Complete");
        });
      }
    }catch(e){
      console.log(e);
    } 
  }
}