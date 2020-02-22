import { Injectable } from '@angular/core';
import { RestClientProvider } from '../../Utilities/rest-client/rest-client';
import { Observable } from 'rxjs/Observable';
import { LoginModel } from '../../Utilities/model/login-model/login-model';

/*
  Generated class for the LoginServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class LoginServiceProvider {

  loginUrl = "/login";
  forgotPasswordUrl = "/user/forgot-password?email="; //return RestClient.put(apiHost + '/user/forgot-password?email=' + email).then(function (response)


  constructor(private RestProvider: RestClientProvider) {
    console.log('Hello LoginServiceProvider Provider');
  }

  LoginService(Login:any) : Observable<LoginModel>{
    return this.RestProvider.postRequest(this.loginUrl, Login);
  }

  forgotPasswordService(data:any) : Observable<LoginModel>{
    return this.RestProvider.putRequest(this.forgotPasswordUrl + data.email, data);
  }

}
