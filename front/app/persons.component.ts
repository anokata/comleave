import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Person } from './person';
import { HttpService } from './http.service';

@Component({
    selector: 'persons',
    template: `
    <div class='form_margin'>Сотрудник: 
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
            });
    }


}
