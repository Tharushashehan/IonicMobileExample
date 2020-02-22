import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController,  Platform } from 'ionic-angular';
import {WifiHotspotServiceProvider} from '../../../providers/wifi-hotspot-service/wifi-hotspot-service';
import { Storage } from '@ionic/storage';
import {DashboardPage} from '../dashboard/dashboard';
/**
 * Generated class for the WifiSetupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wifi-setup',
  templateUrl: 'wifi-setup.html',
})
export class WifiSetupPage {

  responseReturn: any;
  devicePlatform: string = "Phone"; 

  constructor(public navCtrl: NavController, public navParams: NavParams, private WifiHotspotService: WifiHotspotServiceProvider, private alertCtrl: AlertController, public plt: Platform, private storage: Storage) {
    if (this.plt.is('ios')) {
      this.devicePlatform = "iPhone";
    }else if(this.plt.is('android')){
      this.devicePlatform = "Phone";
    }
  }   

  showWifiNetworks: boolean = false;
  showSetup: boolean = true;
  showConnectToNetwork: boolean = false;
  switchOnBelt: boolean = false; 
  connectPhoneToBelt: boolean = false;
  connectionSuccess: boolean = false;
  moveCredentialsToBelt: boolean = false;
  setupComplete: boolean = false;
  connectionFailed: boolean = false;
  items: string[] = [];
  allNetworks: string[] = [];
  securityTypes: string[] = ['None', 'WEP', 'WPA Personal', 'WPA2'];
  hideAdvancedOptions: boolean = true;
  showAdvancedOptions: boolean = false;
  SSIDName: string = "";
  networkPassword: string = "";
  selectedType: string = "WPA2";
  wifiDetails: object = {};
  showLoading: boolean = false;
  subTitle: string = '';
  title: string = '';
  troubleshootingGuideScreenOne: boolean = false;
  troubleshootingGuideScreenTwo: boolean = false;
  passwordType: string = 'text';
  passwordLabel: string = 'HIDE';
  savedNetworks: any = [];
  network: object = {};

  ionViewDidLoad() {
    console.log('ionViewDidLoad WifiSetupPage');
  }  

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordLabel = this.passwordLabel === 'HIDE' ? 'SHOW' : 'HIDE';
  }

  presentAlert(param) {
    if(param == "ssid"){
      this.title = "SSID is empty"
      this.subTitle = "Please enter the SSID to continue";      
    }else if(param == "password"){
      this.title = "Password is empty";
      this.subTitle = "Please enter the Password to continue"; 
    }else{
      this.title = "Security Type not selected";
      this.subTitle = "Please select the Security Type to continue"; 
    }
    let alert = this.alertCtrl.create({
      title: this.title,
      subTitle: this.subTitle,
      buttons: ['OK']
    });
    alert.present();
  }

  saveNetworkPresentAlert(){
    let alert = this.alertCtrl.create({
      title: "Save Wi-Fi Network",
      subTitle: "Would you like to save this Wi-Fi network?",
      buttons: [
        {
          text: 'YES',
          handler: () => {
            var params = {
              ssid: this.SSIDName,
              password: this.networkPassword,
              securityType: this.selectedType
            }
            this.storage.get('UserObject').then((dataElement) => {
              this.WifiHotspotService.saveWifiNetwork(JSON.parse(dataElement).orgId, JSON.parse(dataElement).userId, params).subscribe(
                (data: Response) => {
                  this.showConnectToNetwork = false;
                  this.setupComplete = true;
                  console.log(this.responseReturn, "success");
                },(error: Error) => {
                  this.showConnectToNetwork = false;
                  this.connectionFailed = true;
                  console.log(error, "error");
              },()=>{
                console.log("Complete");
              });
            }
            ,(error)=>{
              console.log(error);
            });              
          }
        },
        {
          text: 'NO',
          handler: () => {
            this.WifiHotspotService.postWifiDetails(this.SSIDName, this.networkPassword, this.selectedType).subscribe(
              (data: Response) => {
                this.showConnectToNetwork = false;
                this.setupComplete = true;
                console.log(this.responseReturn, "success");
              },(error: Error) => {
                this.showConnectToNetwork = false;
                this.connectionFailed = true;
                console.log(error, "error");
            },()=>{
              console.log("Complete");
            });
          }
        }
      ]
    });
    alert.present();
  }

  getSSIDList(){  
    this.connectPhoneToBelt = false; 
    this.showLoading = true;
    var availableNetworks = [];
    this.WifiHotspotService.getSSIDs().subscribe(
      (data: Response) => {
        this.storage.get('SavedNetworks').then((dataElement) => {
          var results = JSON.parse(dataElement);
          for(var i in results){
            this.network = results[i];
            this.savedNetworks.push(this.network);
          }
          console.log(this.savedNetworks);
          this.showLoading = false;    
          this.connectionSuccess = true;          
          this.responseReturn = data;
          this.allNetworks = this.responseReturn.split(",");
          this.allNetworks.forEach((obj)=>{
            var existNotification = this.savedNetworks.find(({ssid}) => obj === ssid)
            if(!existNotification){
              availableNetworks.push(obj);
            }
          });
          availableNetworks.forEach(network => {
              if(network != ''){
                this.items.push(network);
              }
          });
        })
      },(error: any) => {        
        this.showLoading = false;  
        this.connectionFailed = true;             
        console.log("error", error);
    },()=>{
      console.log("Complete");
    });
  } 

  configureWifi() {
    if (!this.SSIDName || this.SSIDName === "") {
      this.presentAlert('ssid');
    }
    else if (!this.networkPassword || this.networkPassword === "") {
      this.presentAlert('password');
    }
    else if (!this.selectedType || this.selectedType === "") {
      this.presentAlert('securityType');
    }
    else {
        console.log(this.SSIDName, " ", this.networkPassword, " ", this.selectedType);
        this.saveNetworkPresentAlert(); 
    }
};

  continueWifiSetup(){
    this.showSetup = false;
    this.switchOnBelt = true;
  }

  connectToHotspot(){
    this.switchOnBelt = false;
    this.connectPhoneToBelt = true;
  }

  showBeltConnectionSuccessMessage(){
    this.connectPhoneToBelt = false;
    this.connectionSuccess = true;
    this.getSSIDList();    
  }

  showConnections(){
    this.connectionSuccess = false; 
    this.connectionFailed = false;
    this.moveCredentialsToBelt = true;       
  }

  navigateBackToNetworkList(){
    this.showWifiNetworks = true;
    this.showConnectToNetwork = false;
  }

  connectBeltToWifi(){
    this.moveCredentialsToBelt = false;
    this.setupComplete = true;
  }

  errorHandler(err: any) {
    alert(`Problem: ${err}`);
  }  

  networkSelected(item){    
    this.SSIDName = item;
    this.moveCredentialsToBelt = false;
    this.showConnectToNetwork = true;
  }

  showAdvanceSettings(){
    this.hideAdvancedOptions= false;
    this.showAdvancedOptions = true;
  }

  hideAdvanceSettings(){
    this.hideAdvancedOptions= true;
    this.showAdvancedOptions = false;
  }

  showTroubleshootingGuide(){
    this.switchOnBelt = false;
    this.troubleshootingGuideScreenOne = true;
  }

  showTroubleshootingGuideTwo(){
    this.connectPhoneToBelt = false;
    this.troubleshootingGuideScreenTwo = true;
  }

  connectToSavedNetwork(network){
    this.WifiHotspotService.postWifiDetails(network.ssid, network.password, network.securityType).subscribe(
      (data: Response) => {
        this.moveCredentialsToBelt = false;
        this.setupComplete = true;
        console.log(this.responseReturn, "success");
      },(error: Error) => {
        this.moveCredentialsToBelt = false;
        this.connectionFailed = true;
        console.log(error, "error");
    },()=>{
      console.log("Complete");
    });
  }

  cancelSetup(){
    console.log("called");
    this.navCtrl.push(DashboardPage);
  }
  
}
