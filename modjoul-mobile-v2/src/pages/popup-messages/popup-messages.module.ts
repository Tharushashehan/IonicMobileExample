import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopupMessagesPage } from './popup-messages';

@NgModule({
  declarations: [
    PopupMessagesPage,
  ],
  imports: [
    IonicPageModule.forChild(PopupMessagesPage),
  ],
})
export class PopupMessagesPageModule {}
