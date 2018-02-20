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
          let wtype = WorkType.OVER;
          if (over.is_over && over.kind == 'O') {
              wtype = WorkType.OVER;
          } else if (!over.is_over && over.kind == 'O') {
              wtype = WorkType.UNWORK;
          } else if (over.kind == 'I') {
              wtype = WorkType.ILL;
          }
          if (wtype == workType) {
              result.push(over);
          }
      });
      return result;
  }
}
