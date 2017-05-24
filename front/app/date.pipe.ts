import { Pipe, PipeTransform } from '@angular/core';
import { Overs } from './overs';
import { Util } from './util';
 
@Pipe({
    name: 'datepipe',
    pure: false
})
export class DatePipe implements PipeTransform {
  transform(value: Overs[], startDate?:Date, endDate?: Date): Overs[] {
      if (value == null) return [];
      if (startDate == null && endDate == null) return value;
      if (startDate == null) {
          startDate = new Date('1000');
      } else {
          startDate = Util.strToDate(startDate);
      }
      if (endDate == null) {
          endDate = new Date('9000');
      } else {
          endDate = Util.strToDate(endDate);
      }
      let result = Array();
      value.forEach((over: Overs) => {
          let date = new Date(over.start_date);
          if (date >= startDate && date <= endDate) {
              result.push(over);
          }
      });
      return result;
  }
}
