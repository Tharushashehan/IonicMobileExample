//Imported modules for app level
import { FormsModule } from '@angular/forms';
import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {ModjoulApp} from './app.component';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { CalendarModule } from "ion2-calendar";
import { HttpClient, HttpClientModule } from '@angular/common/http';
//import { ChartsModule } from 'ng2-charts';
import { ChartsModule } from 'ng2-charts/ng2-charts';

//Imported pages for app level
import {EmployeeTabsPage} from '../pages/EmployeeView/employee-tabs/employee-tabs';
import {AlertsPageModule} from '../pages/EmployeeView/alerts/alerts.module';
import {DashboardPageModule} from '../pages/EmployeeView/dashboard/dashboard.module';
import {GoalsPageModule} from '../pages/EmployeeView/goals/goals.module';
import {MorePageModule} from '../pages/EmployeeView/more/more.module';
import {SharingPageModule} from '../pages/EmployeeView/sharing/sharing.module';
import {LoginPage} from '../pages/Login/login';
import {PopupMessagesPage} from '../pages/popup-messages/popup-messages';
import {WifiSetupPage} from '../pages/EmployeeView/wifi-setup/wifi-setup';
import {Network} from '@ionic-native/network';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {SecondaryDashboardPageModule} from '../pages/EmployeeView/secondary-dashboard/secondary-dashboard.module';
//Imported services named providers
import { RestClientProvider } from '../Utilities/rest-client/rest-client';
import { LoginServiceProvider } from '../providers/login-service/login-service';
import { DashBoardServiceProvider } from '../providers/dash-board-service/dash-board-service';
import { WifiHotspotServiceProvider } from '../providers/wifi-hotspot-service/wifi-hotspot-service';
import {PipesModule} from '../pipes/pipes.module';
import { SecondaryDashboardServiceProvider } from '../providers/secondary-dashboard-service/secondary-dashboard-service';

@NgModule({
    declarations: [
        ModjoulApp,
        EmployeeTabsPage,
        LoginPage,
        PopupMessagesPage,
        WifiSetupPage,
    ],
    imports: [ 
        FormsModule, 
        BrowserModule,
        HttpClientModule,
        IonicModule.forRoot(ModjoulApp),
        AlertsPageModule,
        DashboardPageModule,
        GoalsPageModule,
        MorePageModule,
        SharingPageModule,
        CalendarModule,
        SecondaryDashboardPageModule,
        IonicStorageModule.forRoot(),
        ChartsModule,
        PipesModule,
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        ModjoulApp,
        EmployeeTabsPage,
        LoginPage,
        PopupMessagesPage,
        WifiSetupPage,     
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        RestClientProvider,
        LoginServiceProvider,
        HttpClient,
        Network,
        DashBoardServiceProvider,
        WifiHotspotServiceProvider,
    SecondaryDashboardServiceProvider,
    ]
})
export class AppModule {
}
