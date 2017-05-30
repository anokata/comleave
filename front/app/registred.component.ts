import { Component, OnInit } from '@angular/core';
import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import { HttpModule } from '@angular/http';
import { HttpService} from './http.service';
import { UserService} from './user.service';
import { Person } from './person';
import { Overs } from './overs';
import { Interval } from './interval';
import {ViewChild} from '@angular/core';
import { MessagesComponent } from './messages.component';
import { Util } from './util';
import { PersonsComponent } from './persons.component';
import { WorktypeComponent } from './worktype.component';
import { DoubleDateComponent} from './doubledate.component';
import { Strings } from './strings';
import { Router } from '@angular/router';

@Component({
    selector: 'my-app',
    template: `

<div class='container'> <div class='row justify-content-center'>
    <persons #person></persons>
    <worktypes #worktype></worktypes>
    <doubledate #date [titleOne]="dateTitleFrom" 
    [titleTwo]="dateTitleTo"></doubledate>
</div> </div>

<div class='users table-responsive'>
<table class="table table-striped table-hover table-sm">
<thead class="thead-inverse">
<th class="align-middle">ФИО</th>
<th class="align-middle">Тип</th>
<th class="align-middle">Дата начала</th>
<th class="align-middle">Срок</th>
<th class="align-middle">Комментарий</th>
<th class="align-middle">Дата регистрации заявки</th>
<th class="align-middle text-right" colspan=3>

<div class="text-right" *ngIf="userService.user.is_staff">
       <label class="form-check-label">
       <input class="form-check-input" type="checkbox" [(ngModel)]="is_change">
       Принять с изменением срока
       </label>
        <select class="w-25 d-inline form-control ml-1" [(ngModel)]="selected_interval">
            <option *ngFor="let opt of intervals" [value]="opt.value">
            {{opt.title}}
            </option>
        </select>
</div>

</th>
</thead>
<tbody>
<tr *ngFor="let rec of reqs | personp:person.person_id | worktypep:worktype.worktype  | datepipe:date.dateOne:date.dateTwo">
  <td>{{rec.name}}</td> 
  <td *ngIf="rec.is_over">Переработка</td>
  <td *ngIf="!rec.is_over">Отгул</td>
  <td>{{rec.start_date | date:"dd.MM.yyyy"}}</td> 
  <td>{{rec.interval_str}} </td> 
  <td class='comment'>{{rec.comment}}</td> 
  <td>{{rec.reg_date | date:"HH:MM dd.MM.yyyy"}}</td> 
<div class="text-right d-inline" *ngIf="userService.user.is_staff">
  <td class="d-inline"><button class="btn btn-info m5" (click)="accept(rec.id)">Принять</button> </td> 
  <td class="d-inline"><button class="btn btn-warning m5" (click)="deny(rec.id)">Отклонить</button> </td> 
  </div>

  <div class="text-right d-inline" *ngIf="(userService.user.username == rec.login) || (userService.user.is_staff) ">
  <td class="d-inline">
  <button class="btn btn-danger m5" (click)="edit(rec.id)">Редактировать</button> 
  </td> 
  </div>

</tr>
</tbody>
</table>

<div class="text-center">
    <button *ngIf="total > limit" class='btn btn' (click)="more()">Еще</button>
    <button class='btn btn' (click)="viewAll()">Показать все</button>
</div>

</div>
<messages #msg></messages>
   `,
    providers: [HttpService],
})


export class RegistredComponent implements OnInit { 
  
    reqs: Overs[];
    intervals: Interval[];
    selected_interval: number;
    is_change: boolean = false;
    @ViewChild('msg') msg: MessagesComponent;

    dateTitleFrom: string = Strings.dateTitleFrom;
    dateTitleTo: string = Strings.dateTitleTo;
    @ViewChild('date') date: DoubleDateComponent;
    limit: number = 10;
    total: number;

    constructor(private httpService: HttpService,
                private router: Router,
                private userService: UserService){}
     
    ngOnInit(){

        this.intervals = Array();
        for (let i = 60; i <= 60 * 24; i += 30) {
            this.intervals.push(new Interval(i));
        }
        this.refresh();

    }

    refresh() {
        this.httpService.getReqs(this.limit).subscribe(
        (data: Response) => {
            this.reqs=data.json()['data'];
            this.total=parseInt(data.json()['total']);
            Util.makeIntervalTitles(this.reqs);
            this.date.dateOne = Util.getMinDateStr(this.reqs);
            this.date.dateTwo = Util.getMaxDateStr(this.reqs);
        });
    }

    more() {
        this.limit += 10;
        this.refresh();
    }

    viewAll() {
        this.limit = 0;
        this.refresh();
        this.limit = this.total;
    }

    edit(id: number) {
        this.router.navigate(['/edit', id]);
    }

    remove(id: number) {
        let idx = -1;
        this.reqs.map((e, i) => {if (e.id == id) { idx = i; }});
        if (idx >= 0) {
            this.reqs.splice(idx, 1);
        }
    }

    accept(id: number){
        if (!this.is_change) {
            this.selected_interval = 0;
        }
        this.httpService.actionAccept(id, this.selected_interval).subscribe((data) => {
                this.msg.send("Принята заявка #" + id);
                this.remove(id);
            });
    }

    deny(id: number){
        this.httpService.action('deny', id)
            .subscribe((data) => {
                this.msg.send("Отклонена заявка #" + id);
            });
                this.remove(id);
    }
}
