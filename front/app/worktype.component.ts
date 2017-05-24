import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Person } from './person';
import { WorkType } from './worktype';
import { HttpService } from './http.service';

@Component({
    selector: 'worktypes',
    template: `
    <div class='col mt-3 form-group'>
    Тип: 
    <select class='form-control' [(ngModel)]="worktype">
        <option *ngFor="let worktype of worktypes" [value]="worktype.id">
            {{worktype.name}}
        </option>
    </select>
     </div>
   `,
})
export class WorktypeComponent implements OnInit { 
    worktype: number;
    worktypes: WorkType[];

    constructor(private httpService: HttpService) {};
     
    ngOnInit(){
        this.worktypes = new Array();
        this.worktypes.push(new WorkType('Отгул', WorkType.UNWORK));
        this.worktypes.push(new WorkType('Переработка', WorkType.OVER));
        this.worktypes.push(new WorkType('Все', WorkType.ALL));
        this.worktype = 0;
    }


}
