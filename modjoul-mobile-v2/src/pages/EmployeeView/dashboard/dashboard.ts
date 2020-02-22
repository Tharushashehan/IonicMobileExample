import { IonicPage, NavController, NavParams, ModalController , Slides, ViewController, Platform, LoadingController} from 'ionic-angular';
import {DashBoardServiceProvider} from '../../../providers/dash-board-service/dash-board-service';
import {PopupMessagesPage} from '../../../pages/popup-messages/popup-messages';
import { ScoreCardModel } from '../../../Utilities/model/scorecard-model/scorecard-model';
import { CalendarModal, CalendarModalOptions, DayConfig, CalendarResult, CalendarComponentOptions } from "ion2-calendar";
import { WorkTimeModel } from '../../../Utilities/model/worktime-model/worktime-model';
import {Component, ViewChild, Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';
import {NgForm, FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {SecondaryDashboardPage} from '../secondary-dashboard/secondary-dashboard';
import { Storage } from '@ionic/storage';
import { WorkTimeModelData } from '../../../Utilities/model/worktime-model/worktime-model-data';
import { WorkTimeModelUnit } from '../../../Utilities/model/worktime-model/worktime-model-unit';
import { CardViewModel } from '../../../Utilities/model/cardview-model/cardview-model';
import { STRINGS } from '../../../Common/strings';

/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

interface cardViewItem {
  itemName: string;
  topRight:string;
  bottomRight:string;
  dateVal:string;
  datePretty:string;
}

@IonicPage()
@Component({
    selector: 'page-dashboard',
    templateUrl: 'dashboard.html',
})

export class DashboardPage {

  date: string;
  type: 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  workTime :cardViewItem[] = Array<cardViewItem>();
  workTimeData:Map<string, WorkTimeModelData> = new Map<string, WorkTimeModelData>();
  workTimeUnit:Map<string, WorkTimeModelUnit> = new Map<string, WorkTimeModelUnit>();
                        
  public dateVal: string;
  public selectedDate: moment.Moment;
  public startDate: moment.Moment;
  public endDate: moment.Moment;
  public thisWeekEndDate: moment.Moment;
  public weeks = [];
  public todayDate: moment.Moment;
  public selectedMonth: string;
  public initialNextCount = 0;
  public isSelectionDisabled = false;
  

  @ViewChild('weekSlider') private slider: Slides;

  constructor(public modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams,  private DashBoardService:DashBoardServiceProvider, private storage: Storage, public loadingCtrl: LoadingController) {
    this.dateVal = moment().format();
    this.todayDate = moment();
    this.selectedDate = moment();
    this.selectedMonth = this.selectedDate.format('MMMM');
    this.startDate = moment().startOf('isoWeek');
    this.endDate = moment().endOf('isoWeek');
    this.thisWeekEndDate = moment().endOf('isoWeek');
    this.setWeeklySwipe(null);

    // this.storage.get('OpenCalendarDateObject').then((data) => {
    //     if (data != null) {console.log(JSON.parse(data));
    //         this.callWorkTimeData(JSON.parse(data).string);
    //     }
    //     else {console.log("Do something");}
    //   });
      this.callWorkTimeData(moment().format("YYYY-MM-DD"));

  }
  
  ionViewDidLoad():void {
    console.log('ionViewDidLoad DashboardPage');
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
      duration: 2500
    });
    load.present();
  }

  presentProfileModal(data: string):void {
        let profileModal = this.modalCtrl.create(PopupMessagesPage, { ModalData: data });
        profileModal.present();
      }

    setWeeklySwipe(setDate: moment.Moment):void {
        this.weeks = [];
        if (setDate) {
            this.selectedDate = moment(setDate);
            this.selectedMonth = this.selectedDate.format('MMMM');
            console.log('setDate setWeeklySwipe');
            let startDate = moment(setDate).startOf('isoWeek');
            let endDate = moment(setDate).endOf('isoWeek');
            console.log('endDate', endDate.format());

            let weeks = [];

            for (let i = startDate; moment(i).isBefore(endDate); i.add(1, 'days')) {
                weeks.push(moment(i));
            }

            this.weeks.push({dates: weeks});

            weeks = [];

            for (let j = moment(setDate).add(1, 'weeks').startOf('isoWeek');
                 moment(j).isBefore(moment(setDate).add(1, 'weeks').endOf('isoWeek'));
                 j.add(1, 'days')) {
                weeks.push(moment(j));
            }
            this.weeks.push({dates: weeks});

            weeks = [];

            for (let j = moment(setDate).subtract(1, 'weeks').startOf('isoWeek');
                 moment(j).isBefore(moment(setDate).subtract(1, 'weeks').endOf('isoWeek'));
                 j.add(1, 'days')) {
                weeks.push(moment(j));
            }
            this.weeks.unshift({dates: weeks});

        }
        else {
            console.log('default setWeeklySwipe');
            let weeks = [];

            for (let i = this.startDate; moment(i).isBefore(this.endDate); i.add(1, 'days')) {
                weeks.push(moment(i));
            }

            this.weeks.push({dates: weeks});

            weeks = [];

            for (let j = moment().add(1, 'weeks').startOf('isoWeek');
                 moment(j).isBefore(moment().add(1, 'weeks').endOf('isoWeek'));
                 j.add(1, 'days')) {
                weeks.push(moment(j));
            }
            this.weeks.push({dates: weeks});

            weeks = [];

            for (let j = moment().subtract(1, 'weeks').startOf('isoWeek');
                 moment(j).isBefore(moment().subtract(1, 'weeks').endOf('isoWeek'));
                 j.add(1, 'days')) {
                weeks.push(moment(j));
            }
            this.weeks.unshift({dates: weeks});
        }
    }

    openCalendar():void {
        const options: CalendarModalOptions = {
            title: 'Modjoul',
            canBackwardsSelected: true,
            showYearPicker: true,
            to: Date.now(),
            weekStart: 1
            //from: new Date(2017, 0, 1),
            // defaultSubtitle: "Workday",
            // closeIcon: true,
            // doneIcon:true
            //defaultDateRange : { from: new Date(2017, 0, 1), to: new Date(2017, 0, 5) }
            // from: new Date(2017, 0, 1),
            // to: new Date(2017, 0.11),
        };
        let myCalendar = this.modalCtrl.create(CalendarModal, {
            options: options
        });

        myCalendar.present();
        myCalendar.onDidDismiss((date: CalendarResult, type: string) => {
            if (date) {
                this.storage.set('OpenCalendarDateObject', JSON.stringify(date));
                console.log('openCalendar', date);
                let setDate = moment(date.string, "YYYY-MM-DD");
                console.log('setDate', setDate.format());
                this.setWeeklySwipe(setDate);
                this.callWorkTimeData(date.string); //Loading Work-time data on main calendar date select
            }
        })
    }

    public setSelectedDate(selectedDate: moment.Moment):void {
        if (!this.isSelectionDisabled) {
            console.log('selectedDate', selectedDate.format("YYYY-MM-DD"));
            this.selectedDate = moment(selectedDate);
            this.selectedMonth = this.selectedDate.format('MMMM');
            /* TODO: API call to made when date is selected here */
            this.callWorkTimeData(selectedDate.format("YYYY-MM-DD")); //Loading Work-time data on weekly calendar date select
        }

    }

    loadPrev():void {
        let newIndex = this.slider.getActiveIndex();
        newIndex++;
        newIndex = 1;
        this.selectedDate.subtract(1, 'weeks');
        this.selectedMonth = this.selectedDate.format('MMMM');

        let startDate = moment(this.selectedDate).subtract(1, 'weeks').startOf('isoWeek');
        let endDate = moment(this.selectedDate).subtract(1, 'weeks').endOf('isoWeek');
        let weeks = [];

        for (let i = startDate; moment(i).isBefore(endDate); i.add(1, 'days')) {
            weeks.push(moment(i));
        }
        this.weeks.unshift({dates: weeks});
        this.weeks.pop();
        this.slider.slideTo(newIndex, 0, false);
    }

    loadNext():void {
        this.initialNextCount++;

        console.log('loadNext');
        if (this.initialNextCount != 1) {
            let newIndex = this.slider.getActiveIndex();
            newIndex--;
            newIndex = 1;
            this.selectedDate.add(1, 'weeks');
            this.selectedMonth = this.selectedDate.format('MMMM');
            let startDate = moment(this.selectedDate).add(1, 'weeks').startOf('isoWeek');
            let endDate = moment(this.selectedDate).add(1, 'weeks').endOf('isoWeek');
            let weeks = [];
            for (let i = startDate; moment(i).isBefore(endDate); i.add(1, 'days')) {
                weeks.push(moment(i));
            }
            this.weeks.push({dates: weeks});
            this.weeks.shift();
            this.slider.slideTo(newIndex, 0, false);
        }
    }

    slideChangeEnded():void {
        this.isSelectionDisabled = false;
    }

    slideChangeStarting():void {
        this.isSelectionDisabled = true;
    }
//#region 
//   callScoreCard(dateString:string){
//     this.storage.get('UserObject').then((data) => {
//         if (data != null) {
//             let dataToSent = {period: dateString, type: "daily", orgId:JSON.parse(data).orgId, userId:JSON.parse(data).userId}
//             this.DashBoardService.WorkTimeService(dataToSent).subscribe(
//                 (data: WorkTimeModel) => {
//                   console.log(data);
//                   Object.keys(data.activities).forEach( key => {
//                       let i=0;
//                       let first:number;
//                       let second:number;
//                     Object.keys(data.activities[key]).forEach(innerKey =>{
//                         if(i==0){
//                             first = parseInt(data.activities[key][innerKey]);
//                         }
//                         else if(i==1){
//                             second = parseInt(data.activities[key][innerKey]);
//                         }
//                         i++;
//                     });
//                     this.workTime.push({ItemName: key.toString(), Steps: first, Count: second, DateVal:dateString});

//                 });
//                 console.log(this.workTime);
//                 },(error: Error) => {
//                   console.log(error); 
//                   this.presentProfileModal(error.toString());
//               },()=>{
//                 console.log("Complete");
//               });
//         }
//         else {console.log("Do something");}
//       },(error)=>{
//         console.log(error);
//       });
//   }
//#endregion

//This calls for the work time data to load
  callWorkTimeData(dateString:string):void{
    this.storage.get('UserObject').then((dataElement) => {
        if (dataElement != null) {
            this.workTimeData.clear();
            this.workTimeUnit.clear();
            let typeString = ["daily", "weekly", "monthly"];
            let dateStringNew;
            typeString.forEach(element =>{
                if(element=="daily"){
                    dateStringNew =  dateString;
                }
                else if(element=="weekly"){
                    dateStringNew =  moment(dateString).format("YYYY-[W]ww");
                }
                else if(element=="monthly"){
                    dateStringNew =  moment(dateString).format("YYYY-MM");
                }
                let dataToSent = {period: dateStringNew, type: element, orgId:JSON.parse(dataElement).orgId, userId:JSON.parse(dataElement).userId}
                this.DashBoardService.WorkTimeService(dataToSent).subscribe(
                    (data: WorkTimeModel) => {
                        this.workTimeData.set(element, data.activities);
                        this.workTimeUnit.set(element, data.units);
                        if(element=="daily"){
                            this.loadCardViewdata(this.workTimeData, this.workTimeUnit, dateString);
                        }
                    },(error: Error) => {
                      console.log(error); 
                      this.presentProfileModal(error.toString());
                  },()=>{
                    console.log("Complete");
                  });
            });
        }
        else {console.log("Do something");}
      },(error)=>{
        console.log(error);
      });
  }

  //This fills data in to the card view data source(this.workTime object array)
  loadCardViewdata(workTimeDataset:Map<string, WorkTimeModelData>, workTimeUnitset:Map<string, WorkTimeModelUnit>, dateString:string):void{
    let cardViewModelTemp={};
    this.workTime.length = 0;  
    if(!(Object.keys(workTimeDataset.get(STRINGS.TYPESEGMENTS[0])).length===0 && workTimeDataset.get(STRINGS.TYPESEGMENTS[0]).constructor === Object)){
        this.loading();
        for (var key in STRINGS.CARDVIEW_MODEL_ARRAY) {
            if (STRINGS.CARDVIEW_MODEL_ARRAY.hasOwnProperty(key)) {
                let topRight:string;
                let bottomRight:string;
                let increment = 0;
                cardViewModelTemp[key] = {};
                STRINGS.CARDVIEW_MODEL_ARRAY[key].forEach(element => {
                    cardViewModelTemp[key][element] = parseInt(workTimeDataset.get(STRINGS.TYPESEGMENTS[0])[key][element]);
                    if(increment==0){
                        topRight = workTimeDataset.get(STRINGS.TYPESEGMENTS[0])[key][element] +" "+workTimeUnitset.get(STRINGS.TYPESEGMENTS[0])[key][element];
                    }else if (increment==1){
                        bottomRight = workTimeDataset.get(STRINGS.TYPESEGMENTS[0])[key][element] +" "+ workTimeUnitset.get(STRINGS.TYPESEGMENTS[0])[key][element];
                    }
                    increment++;
                });
                this.workTime.push({itemName: key.toString(), topRight: topRight, bottomRight: bottomRight, dateVal:dateString, datePretty:moment(dateString).format("MMMM-DD")});
            }
        }
    }
    //#region 
    // console.log(this.workTime);
    // let cardViewModel: CardViewModel = <CardViewModel> cardViewModelTemp; 
    // console.log(cardViewModel);
    // Object.keys(cardViewModel).forEach(key => {
    //     // let arr:Array<any> = Array<any>();
    //     console.log(key);
    //     Object.keys(cardViewModel[key]).forEach(innerKey => {
    //         console.log(innerKey);
    //     })
    // });
    //this.workTime.push({ItemName: key.toString(), Steps: steps, Count: count, DateVal:dateString});
    //   this.cardViewModelArray.forEach(element => {
    //       console.log(element);
    //   },key=>{
    //     console.log(key);
    //   }
    //   );
        //     Object.keys(cardViewModelArray).forEach( key => {
        //       Object.keys(CardViewModel).forEach(innerKey =>{
        //           if(workTimeDataset["daily"][key][innerKey]){
        //             crdViewModelData[key][innerKey] = parseInt(workTimeDataset["daily"][key][innerKey]);
        //               console.log(workTimeUnitset[key][innerKey]);
        //           }
        //           if(workTimeDataset["daily"][key][innerKey]){
        //             crdViewModelData["daily"][key][innerKey] = parseInt(workTimeDataset["daily"][key][innerKey]);
        //               console.log(workTimeUnitset[key][innerKey]);
        //           }
        //       });
        //       this.workTime.push({ItemName: key.toString(), Steps: crdViewModelData.indoor_driving.IndoorDrivingTime, Count: crdViewModelData.sitting_standing.SittingStandingTime, DateVal:dateString});
        //   });
        //#endregion
  }

  //This loads the seciond level dash bord page
  loadSecondaryDashboard(index:number, workTime:cardViewItem):void{
    console.log(index);
    console.log(workTime);
    this.navCtrl.setRoot(SecondaryDashboardPage, workTime);
  }
  
}
