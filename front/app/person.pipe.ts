import { Pipe, PipeTransform } from '@angular/core';
import { Overs } from './overs';
import { Person } from './person';
 
@Pipe({
    name: 'personp',
    pure: false
})
export class PersonPipe implements PipeTransform {
  transform(value: Overs[], person_id?:number, args?: any): Overs[] {
      if (value == null) return [];
      if (person_id == -1 || person_id == null) return value;
      let result = Array();
      value.forEach((over: Overs) => {
          if (over.person_id == person_id) {
              result.push(over);
          }
      });
      return result;
  }
}
