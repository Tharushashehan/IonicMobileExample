import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SecondaryDashboardPage } from './secondary-dashboard';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import {PipesModule} from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    SecondaryDashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(SecondaryDashboardPage),
    ChartsModule,
    PipesModule,
  ],
})
export class SecondaryDashboardPageModule {}
