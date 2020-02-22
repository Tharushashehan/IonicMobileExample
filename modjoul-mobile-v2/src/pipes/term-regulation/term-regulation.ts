import { Pipe, PipeTransform } from '@angular/core';
import { STRINGS } from '../../Common/strings';

/**
 * Generated class for the TermRegulationPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'termRegulation',
})
export class TermRegulationPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {
    let valueToReturn:string = value.toUpperCase();
    STRINGS.TERM_REGULATION_ARRAY.forEach(element => {
      if(value === element[0]){
        valueToReturn = element[1];
      };
    });
    return valueToReturn;
  }
}
