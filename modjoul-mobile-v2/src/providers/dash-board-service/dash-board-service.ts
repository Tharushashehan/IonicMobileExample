import { Injectable } from '@angular/core';
import { RestClientProvider } from '../../Utilities/rest-client/rest-client';
import { Observable } from 'rxjs/Observable';
import { ScoreCardModel } from '../../Utilities/model/scorecard-model/scorecard-model';
import { Storage } from '@ionic/storage';
import { UserModel } from '../../Utilities/model/user-model/user-model';
import { WorkTimeModel } from '../../Utilities/model/worktime-model/worktime-model';
/*
  Generated class for the DashBoardServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DashBoardServiceProvider {

  // scoreCardUrl: string; //'/organizations/' + orgId + '/users/' + userId + '/scorecard?' +'period=' + params.period + "&type=" + params.type
  // workTimeUrl : string; //'/organizations/' + orgId + '/users/' + userId + '/work-time?' + 'period=' + params.period + '&type=' + params.type;

  constructor(private RestProvider: RestClientProvider) {
    console.log('Hello DashBoardServiceProvider Provider');
  }

  // ScorecardService(params:any) : Observable<ScoreCardModel>{
  //     this.storage.get('UserObject').then((data) => {
  //     if (data != null) {
  //       this.scoreCardUrl = '/organizations/' + JSON.parse(data).orgId + '/users/' + JSON.parse(data).userId + '/scorecard?' +'period=' + params.period + "&type=" + params.type;
  //     }
  //     else {console.log("Do something");}
  //   },(error)=>{
  //     console.log(error);
  //   });
  //   console.log(this.scoreCardUrl);
  //   return this.RestProvider.getRequest(this.scoreCardUrl);
  // }

  WorkTimeService(params:any) : Observable<WorkTimeModel> {
    let scoreCardUrl = '/organizations/' + params.orgId + '/users/' + params.userId + '/work-time?' + 'period=' + params.period + '&type=' + params.type;
    return this.RestProvider.getRequest(scoreCardUrl);
  }

}
