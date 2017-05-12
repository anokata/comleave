import { Component, OnInit } from '@angular/core';
import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import { HttpModule } from '@angular/http';
import { HttpService} from './http.service';

export class Person{
    name: string;
    is_manager: boolean;
}

export class Overs {
    reg_date: Date;
    start_date: string;
    interval: number;
    status: string;
    comment: string;
    person: Person;
    name: string;
    start: string;
    is_over: boolean;
    id: number;
}

export class Summarize {
    name: string;
    unwork: number;
    overwork: number;
    total: number;
}

export class Interval {
    public title: string;

    constructor (public value:number) {
        this.title = Math.floor(value / 60).toString() + ' hour ';
        if ((value % 60) != 0) {
            this.title += (value % 60).toString() + ' min';
        }
    }
}

@Component({
    selector: 'my-app',
    template: `<div class='users'>
    <table>
    <thead>
    <th>ФИО</th>
    <th>Отгул</th>
    <th>Переработка</th>
    <th>Итог</th>
    </thead>
    <tbody>
    <tr *ngFor="let rec of sums">
      <td>{{rec.name}}</td> 
      <td>{{rec.unwork}}</td> 
      <td>{{rec.overwork}}</td> 
      <td>{{rec.total}}</td> 
    </tr>
    </tbody>
    </table>


    <table>
    <thead>
    <th>ФИО</th>
    <th>Тип</th>
    <th>Дата начала</th>
    <th>Срок</th>
    <th>Коментарий</th>
    <th>Дата регистрации заявки</th>
    </thead>
    <tbody>
    <tr *ngFor="let rec of reqs">
      <td>{{rec.name}}</td> 
      <td *ngIf="rec.is_over">Переработка</td>
      <td *ngIf="!rec.is_over">Отгул</td>
      <td>{{rec.start}}</td> 
      <td>{{rec.interval}}</td> 
      <td>{{rec.comment}}</td> 
      <td>{{rec.reg_date}}</td> 
      <td><button class="btn" (click)="accept(rec.id)">Принять</button> </td> 
      <td><button class="btn" (click)="deny(rec.id)">Отклонить</button> </td> 
    </tr>
    </tbody>
    </table>
    <br>
    Дата: <input type="text" id="datepicker">
    <br>
    Срок:
    <select>
        <option *ngFor="let opt of intervals">
        {{opt.title}}
        </option>
    </select>
    <br>
    Комментарий: <input type=text >
    <br>
    <select>
    <option *ngFor="let person of persons">
    {{person.name}}
    </option>
    </select>
               </div>`,
    providers: [HttpService]
})


export class AppComponent implements OnInit { 
  
    persons: Person;
    overs: Overs;
    sums: Array<Summarize>;
    reqs: Array<Overs>;
    intervals: Interval[];

    //in_person: string;
     
    constructor(private httpService: HttpService){}
     
    ngOnInit(){
        let datep: any;
        datep = $("#datepicker");
        datep.datepicker();
        
        this.intervals = Array();
        for (let i = 60; i < 60 * 24; i += 30) {
            this.intervals.push(new Interval(i));
        }

        this.httpService.getData().subscribe(
            (data: Response) => {
                return this.persons=data.json();
            });
         
        this.httpService.getOvers().subscribe(
        (data: Response) => {
            this.overs=data.json();
            }
        );

        this.httpService.getSum().subscribe(
        (data: Response) => {
            this.sums=data.json();
            this.sums.map((e:Summarize) => e.total = e.overwork - e.unwork);
        });

        this.httpService.getReqs().subscribe(
        (data: Response) => {
            this.reqs=data.json();
            this.reqs.map((e:Overs) => {
                e.start = new Date(e.start_date)['toLocaleFormat']('%d.%m.%Y');
                return e;
            });
        });
    }

    remove(id: number) {
        let idx = -1;
        this.reqs.map((e, i) => {if (e.id == id) { idx = i; }});
        if (idx >= 0) {
            this.reqs.splice(idx, 1);
        }
    }

    accept(id: number){
        this.httpService.actionAccept(id)
                .subscribe((data) => {console.log('sended');});
                this.remove(id);
    }

    deny(id: number){
        this.httpService.action('deny', id)
                .subscribe((data) => {console.log('sended');});
                this.remove(id);
    }
}
