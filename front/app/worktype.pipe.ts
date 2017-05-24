import { Pipe, PipeTransform } from '@angular/core';
import { Overs } from './overs';
import { WorkType } from './worktype';
 
@Pipe({
    name: 'worktypep',
    pure: false
})
export class WorktypePipe implements PipeTransform {
  transform(value: Overs[], workType?:number, args?: any): Overs[] {
      if (value == null) return [];
      if (workType == 0 || workType == null) return value;
      let result = Array();
      value.forEach((over: Overs) => {
          let wtype = over.is_over ? WorkType.OVER : WorkType.UNWORK;
          if (wtype == workType) {
              result.push(over);
          }
      });
      return result;
  }
}
