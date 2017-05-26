import { Component, OnInit, Input } from '@angular/core';
import { Response } from '@angular/http';
import { Person } from './person';
import { HttpService } from './http.service';

@Component({
    selector: 'persons',
    template: `
    <div class='col mt-3 form-group'>
    Сотрудник: 
    <select class='form-control' [(ngModel)]="person_id">
        <option *ngFor="let person of persons" [value]="person.id">
            {{person.name}}
        </option>
    </select>
    </div>
   `,
})
export class PersonsComponent implements OnInit { 
    person_id: number;
    persons: Person[];
    @Input() default_name: string='';

    constructor(private httpService: HttpService) {};
     
    ngOnInit(){
        this.httpService.getData().subscribe(
            (data: Response) => {
                this.persons=data.json();
                let allPerson = new Person();
                allPerson.name = 'Все';
                allPerson.id = -1;
                this.persons.unshift(allPerson);
                this.person_id = this.persons[0].id;
                if (this.default_name) {
                    this.persons.forEach((e) => {
                        if (e.login == this.default_name) {
                            this.person_id = e.id;
                        }
                    });
                }
            });
    }


}
