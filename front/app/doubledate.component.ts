import { Component, OnInit, Input } from '@angular/core';
import { Util } from './util';
import {ViewChild} from '@angular/core';

@Component({
    selector: 'doubledate',
    template: `
        <div class='col-md-5 mt-3 form-group'> <div>
        {{titleOne}}
        <input class='form-control ' type="text" id='datepicker1' [(ngModel)]="dateOne" >
        </div> </div>
        <div class='col-md-5 mt-3 form-group'> <div>
        {{titleTwo}}
        <input getDate class='form-control ' type="text" id='datepicker2' [(ngModel)]="dateTwo" >
        </div> </div>
   `,
})
export class DoubleDateComponent implements OnInit { 
    public dateOne: string = "01.01.1000";
    public dateTwo: string = "01.01.3000";
    @Input() titleOne: string;
    @Input() titleTwo: string;

    constructor() {};
     
    ngOnInit(){
        this.dateOne = Util.dateToStr(new Date());
        this.dateTwo = Util.dateToStr(new Date());

        let datep: JQuery;
        datep = $("#datepicker1");
        let date: any = $(datep);
        this.setup(date);
        date.datepicker("option", "onSelect", (date: string) => 
            { 
                this.dateOne = date;
            });
        datep = $("#datepicker2");
        date = $(datep);
        this.setup(date);
        date.datepicker("option", "onSelect", (date: string) => 
            { 
                this.dateTwo = date;
            });
    }

    setup(dp: any) {
        dp.datepicker();
        dp.datepicker("option", "dateFormat", "dd.mm.yy");
        dp.datepicker("option", "changeMonth", "true");
        dp.datepicker("option", "changeYear", "true");
    }
}
