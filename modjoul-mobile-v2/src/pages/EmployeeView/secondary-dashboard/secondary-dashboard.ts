import {Component, ViewChild, Pipe, PipeTransform} from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController} from 'ionic-angular';
import {DashboardPage} from '../../EmployeeView/dashboard/dashboard';
import {PopupMessagesPage} from '../../../pages/popup-messages/popup-messages';
import {SecondaryDashboardServiceProvider} from '../../../providers/secondary-dashboard-service/secondary-dashboard-service';
import { Storage } from '@ionic/storage';
import 'chart.js';

/**
 * Generated class for the SecondaryDashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-secondary-dashboard',
  templateUrl: 'secondary-dashboard.html',
})
export class SecondaryDashboardPage {

  secondaryDashboardName:string;
  secondaryDashboardDate:string;
  segmentSelectItem:string;

  constructor(public modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private SecondaryDashboardService:SecondaryDashboardServiceProvider) {
    console.log(navParams.get('ItemName'));
    this.secondaryDashboardName = navParams.get('itemName');
    this.secondaryDashboardDate = navParams.get('datePretty');
    this.segmentSelectItem = "daily";
    this.callGraphData(this.secondaryDashboardDate, this.segmentSelectItem, this.secondaryDashboardName);
  }

  ionViewDidLoad():void {
    console.log('ionViewDidLoad SecondaryDashboardPage');
  }

  presentProfileModal(data: string):void {
    let profileModal = this.modalCtrl.create(PopupMessagesPage, { ModalData: data });
    profileModal.present();
  }

  loadDashboard():void{
    this.navCtrl.setRoot(DashboardPage);
  }

//Setup chart as bellow
  public chartColors:Array<any> = [{
    backgroundColor: '#F99D1C',
    borderColor: '#B06804',
    pointBackgroundColor: '#E9E9E9',
    pointBorderColor: '#E9E9E9',
    pointHoverBackgroundColor: '#E9E9E9',
    pointHoverBorderColor: '#E9E9E9'
  }];

  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      xAxes: [{
        display: true,
        gridLines: {
          display: true,
          color: '#B06804'
        },
        scaleLabel: {
          display: true,
          labelString: 'Metric'
        }
      }],
      yAxes: [{
        display: true,
        gridLines: {
          display: true,
          color: '#B06804'
        },
        scaleLabel: {
          display: true,
        }
      }]
    }
  };
  public barChartLabels:string[] = ['<45', '45', '<60', '60', '<75', '75'];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;
  
  public barChartData:any[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Walking'}
  ];
  
  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
  
  public chartHovered(e:any):void {
    console.log(e);
  }
  
  public randomize():void {
    // Only Change 3 values
    let data = [
      Math.round(Math.random() * 100),
      59,
      80,
      (Math.random() * 100),
      56,
      (Math.random() * 100),
      40];
    let clone = JSON.parse(JSON.stringify(this.barChartData));
    clone[0].data = data;
    this.barChartData = clone;
    /**
     * (My guess), for Angular to recognize the change in the dataset
     * it has to change the dataset variable directly,
     * so one way around it, is to clone the data, change it and then
     * assign it;
     */
  }

//Getting data to load into the chart
  callGraphData(dateString:string, typeString:string, cardNameString:string){
    this.storage.get('UserObject').then((data) => {
        if (data != null) {
            let dataToSent = {period: dateString, type: typeString, cardName:cardNameString, orgId:JSON.parse(data).orgId, userId:JSON.parse(data).userId}
            this.SecondaryDashboardService.graphDataLoad(dataToSent).subscribe(
                (data: any) => {
                  console.log(data);
                },(error: Error) => {
                  console.log(error); 
                  this.presentProfileModal(error.toString());
              },()=>{
                console.log("Complete");
              });
        }
        else {console.log("Do something");}
      },(error)=>{
        console.log(error);
      });
  }
}
