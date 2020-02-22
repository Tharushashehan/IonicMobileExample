import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SharingPage } from './sharing';

@NgModule({
  declarations: [
    SharingPage,
  ],
  imports: [
    IonicPageModule.forChild(SharingPage),
  ],
})
export class SharingPageModule {}
