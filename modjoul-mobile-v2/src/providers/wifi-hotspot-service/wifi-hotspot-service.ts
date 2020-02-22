import { Injectable } from '@angular/core';
import { RestClientProvider } from '../../Utilities/rest-client/rest-client';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';

@Injectable()
export class WifiHotspotServiceProvider {

  // serviceUrl = "http://192.168.1.1";  
  serviceUrl = "http://127.0.0.1:3000";
  getSSIDspayload = {
    flag: 1
  };
  credentialspayload = {
    flag: 2,
    ssid: '',
    password: '',
    securityType: ''
  };  
  savedWifiNetworksUrl: string;

  constructor(private RestProvider: RestClientProvider, private storage: Storage) {
    console.log('Hello from WifiHotspotServiceProvider');
  }

  getSSIDs() : Observable<any>{
    console.log("called SSIDs");
    return this.RestProvider.postWiFiHotspotRequest(this.serviceUrl, this.getSSIDspayload);
  }

  postWifiDetails(ssid:string, password:string, securityType:string) : Observable<any>{
    this.credentialspayload.ssid = ssid; 
    this.credentialspayload.password = password;
    this.credentialspayload.securityType = securityType; 
    return this.RestProvider.postWiFiHotspotRequest(this.serviceUrl, this.credentialspayload);
  }

  saveWifiNetwork(orgId: string, userId: string, params:any) : Observable<any>{ 
      this.savedWifiNetworksUrl = '/organizations/' + orgId + '/users/' + userId + '/wifi-network';
      console.log(this.savedWifiNetworksUrl);
      return this.RestProvider.postRequest(this.savedWifiNetworksUrl, params); 
  }

  getWifiNetworksList(orgId: string, userId: string) : Observable<any>{
    this.savedWifiNetworksUrl = '/organizations/' + orgId + '/users/' + userId + '/wifi-network';
    console.log(this.savedWifiNetworksUrl);
    return this.RestProvider.getRequest(this.savedWifiNetworksUrl); 
  }

}
