import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpModule } from '@angular/http';
import { HttpService} from './http.service';
import { UserService} from './user.service';
import { Interval } from './interval';
import { Strings } from './strings';
import { ViewChild } from '@angular/core';
import { DoubleDateComponent} from './doubledate.component';

export class Summarize {
    name: string;
    unwork: number;
    overwork: number;
    total: number;
    overworkStr: string;
    unworkStr: string;
    totalStr: string;
    isNegative: boolean;
    ill: number;
    illStr: string;
}

@Component({
    selector: 'my-app',
    template: `
    <div class='container'> <div class='row justify-content-center'>
        <persons #person [default_name]="def_name"></persons>
        <doubledate #date [titleOne]="dateTitleFrom" 
            [titleTwo]="dateTitleTo" (change)=filter()></doubledate>
        <div class='col mt-3 form-group'>
            <button class="btn btn-info m5" (click)=filter()>Применить</button>  
        </div>
    </div> </div>


    <div class='users table-responsive'>
    <table class="table table-striped table-hover table-sm">
    <thead class="thead-inverse">
    <th>ФИО</th>
    <th>Отгул</th>
    <th>Переработка</th>
    <th>Итог</th>
    <th>Больничный</th>
    </thead>
    <tbody>
    <tr *ngFor="let rec of sums | personp:person.person_id">
      <td class=""> {{rec.name}} ({{rec.login}})</td> 
      <td>{{rec.unworkStr}}</td> 
      <td>{{rec.overworkStr}}</td> 
      <td *ngIf="!rec.isNegative" class='font-weight-bold text-primary'>{{rec.totalStr}}</td> 
      <td *ngIf="rec.isNegative" class='font-weight-bold text-danger'>-{{rec.totalStr}}</td> 
      <td>{{rec.illStr}}</td> 
    </tr>
    </tbody>
    </table>
    </div>`,
    providers: [HttpService]
})


export class SummaryComponent implements OnInit { 
  
    sums: Array<Summarize>;
    def_name: string = '';
    dateTitleFrom: string = Strings.dateTitleFrom;
    dateTitleTo: string = Strings.dateTitleTo;
    @ViewChild('date') date: DoubleDateComponent;

    constructor(private httpService: HttpService,
                private userService: UserService){}

    refresh(data: Response) {
        this.sums=data.json();
        this.sums.map((e: Summarize) => {
            e.total = e.overwork - e.unwork;
            e.overworkStr = Interval.makeRuTitle(e.overwork);
            e.unworkStr = Interval.makeRuTitle(e.unwork);
            e.totalStr = Interval.makeRuTitle(Math.abs(e.total));
            e.illStr = Interval.makeRuTitleDays(Math.abs(e.ill));
            e.isNegative = e.total < 0;
        });
    }
     
    ngOnInit(){

        this.httpService.getSum().subscribe((data: Response) => {this.refresh(data)});
        if (!this.userService.user.is_staff) {
            this.def_name = this.userService.user.username;
        }
    }

    filter() {
        this.httpService.getSumFiltred(this.date.dateOne, this.date.dateTwo).subscribe((data: Response) => {this.refresh(data)});
    }
}

