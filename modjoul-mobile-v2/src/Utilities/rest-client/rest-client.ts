import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as Constants from '../../Common/Constants';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap'
import {Headers, Http, RequestOptions} from "@angular/http";

/*
  Generated class for the RestClientProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/


@Injectable()
export class RestClientProvider {

  resultErrorData: any;

  constructor(private http: HttpClient, private storage: Storage) {
    console.log('Hello RestClientProvider Provider ' + Constants.API_ENDPOINT);
  }

  getAccessToken(): Observable<any>{
    return Observable.fromPromise(this.storage.get('accessToken').then((data)=>{
      return data;
    },(error)=>{
      return null;
    }));
  }

  errorHandler(error: Error): Observable<any> {
    this.resultErrorData = error;
    if (this.resultErrorData.status === 401) {
      console.log("Unauthorized User")
      return Observable.throw("Unauthorized User");
    }
    if (this.resultErrorData.status === 500) {
      console.log("Internal Server Error")
      return Observable.throw("Internal Server Error");
    }
    else if (this.resultErrorData.status === 400) {
      console.log("Bad Request Error")
      return Observable.throw("Bad Request Error");
    }
    else if (this.resultErrorData.status === 409) {
      console.log("Conflict Error")
      return Observable.throw("Conflict Error");
    }
    else if (this.resultErrorData.status === 406) {
      console.log("Not Acceptable Error")
      return Observable.throw("Not Acceptable Error");
    }
    else{
      return Observable.throw("System Error, Please contact System Admin");
    }
  }

  postRequest(url : string , dataRecived : any): Observable<any>{
    return this.getAccessToken().flatMap(data => {
      let endpointConfig = {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + data
            }
          };
      return this.http.post<any>(Constants.API_ENDPOINT + url, dataRecived, endpointConfig)
      .catch((e: Error) => this.errorHandler(e));
  });
    }
  
  getRequest(url : string): Observable<any>{
    return this.getAccessToken().flatMap(data => {
      let endpointConfig = {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + data
            }
          };
      return this.http.get<any>(Constants.API_ENDPOINT + url, endpointConfig)
      .catch((e: Error) => this.errorHandler(e));
  });
    }
    
  deleteRequest(url : string): Observable<any>{
    return this.getAccessToken().flatMap(data => {
      let endpointConfig = {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + data
            }
          };
      return this.http.delete<any>(Constants.API_ENDPOINT + url, endpointConfig)
      .catch((e: Error) => this.errorHandler(e));
  });
    }
    
  putRequest(url : string, dataRecived : any){
    return this.getAccessToken().flatMap(data => {
      let endpointConfig = {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + data
            }
          };
      return this.http.put<any>(Constants.API_ENDPOINT + url, dataRecived, endpointConfig)
      .catch((e: Error) => this.errorHandler(e));
  });
    }
    
  patchRequest(url : string, dataRecived : any){
    // this.setEndpointConfigs();
    // return this.http.patch<any>(Constants.API_ENDPOINT + url, data, this.endpointConfig)
    // .catch((e: Error) => this.errorHandler(e));

    return this.getAccessToken().flatMap(data => {
      let endpointConfig = {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + data
            }
          };
      return this.http.patch<any>(Constants.API_ENDPOINT + url, dataRecived, endpointConfig)
      .catch((e: Error) => this.errorHandler(e));
  });
    }

    postWiFiHotspotRequest(url : string , dataRecived : any): Observable<any>{
      let endpointConfig = {
        headers: {
          'Content-Type': 'application/json',          
        },
        responseType: 'text' as 'json'
      };
      return this.http.post<any>(url, dataRecived, endpointConfig)
      .catch((e: any) => this.errorHandler(e));
      }  

}
