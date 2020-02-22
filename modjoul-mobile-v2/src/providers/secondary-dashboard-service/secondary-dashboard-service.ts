import { Injectable } from '@angular/core';
import { RestClientProvider } from '../../Utilities/rest-client/rest-client';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the SecondaryDashboardServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SecondaryDashboardServiceProvider {

  constructor(private RestProvider: RestClientProvider) {
    console.log('Hello SecondaryDashboardServiceProvider Provider');
  }

  graphDataLoad(params:any) : Observable<any> {
    console.log("Hello");
    let url = '/organizations/' + params.orgId + '/users/' + params.userId + '/'+ params.cardName +'?' + 'period=' + params.period + '&type=' + params.type;
    return this.RestProvider.getRequest(url);
  }

}
