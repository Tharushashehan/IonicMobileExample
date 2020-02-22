import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WifiSetupPage } from './wifi-setup';

@NgModule({
  declarations: [
    WifiSetupPage,
  ],
  imports: [
    IonicPageModule.forChild(WifiSetupPage),
  ],
})
export class WifiSetupPageModule {}
