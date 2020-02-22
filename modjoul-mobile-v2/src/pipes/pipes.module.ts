import { NgModule } from '@angular/core';
import { TermRegulationPipe } from './term-regulation/term-regulation';
import { TimeFilterPipe } from './time-filter/time-filter';
@NgModule({
	declarations: [TermRegulationPipe,
    TimeFilterPipe],
	imports: [],
	exports: [TermRegulationPipe,
    TimeFilterPipe]
})
export class PipesModule {}
