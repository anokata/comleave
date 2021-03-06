import { Component, OnInit, Input } from '@angular/core';
import { Util } from './util';
import {ViewChild} from '@angular/core';

@Component({
    selector: 'datepicker',
    template: `
        <div class=''> <div>
        {{title}}
        <input #getDate class='form-control datepicker' type="text" [(ngModel)]="date" >
        </div> </div>
   `,
})
export class DatepickerComponent implements OnInit { 
    public date: string;
    @Input() title: string;
    @Input() name: string = 'name';
    @Input() inDate: string;
    @ViewChild('getDate') public getDate: any;

    constructor() {};
     
    ngOnInit(){
        this.date = Util.setupDate();
        let datep: JQuery;
        datep = $(".datepicker");
        datep.each((i: number, datep: any) => {
            let date: any = $(datep);
            date.datepicker("option", "onSelect", (date: string) => 
                { 
                    this.date = date;
                });
        })
        if (this.inDate) {
            this.date = this.inDate;
        }
    }
}
