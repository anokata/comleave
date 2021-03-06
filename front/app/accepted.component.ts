import { Component, OnInit } from '@angular/core';
import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import { HttpModule } from '@angular/http';
import { HttpService} from './http.service';
import { UserService} from './user.service';
import { Person } from './person';
import { Overs } from './overs';
import {ViewChild} from '@angular/core';
import { MessagesComponent } from './messages.component';
import { Util } from './util';
import { DoubleDateComponent} from './doubledate.component';
import { Strings } from './strings';
import { Filter } from './filter';
import { Type } from './type';

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
    </thead>
    <tbody>
    <tr *ngFor="let rec of reqs | personp:person.person_id | worktypep:worktype.worktype  | datepipe:date.dateOne:date.dateTwo;let i=index">
      <td *ngIf="i>=offset && i < offset + limit ">{{rec.name}}</td> 
      <td *ngIf="i>=offset && i < offset + limit && rec.is_over && rec.kind == 'O'">Переработка</td>
      <td *ngIf="i>=offset && i < offset + limit && !rec.is_over && rec.kind == 'O'">Отгул</td>
      <td *ngIf="i>=offset && i < offset + limit && rec.kind == 'I'">Больничный</td>
      <td *ngIf="i>=offset && i < offset + limit ">{{rec.start_date | date:"dd.MM.yyyy"}}</td> 
      <td *ngIf="i>=offset && i < offset + limit ">{{rec.interval_str}}</td> 
      <td *ngIf="i>=offset && i < offset + limit " class='comment'>{{rec.comment}}</td> 
      <td *ngIf="i>=offset && i < offset + limit ">{{rec.reg_date | date:"HH:mm dd.MM.yyyy"}}</td> 
      <div *ngIf="i>=offset && i < offset + limit && userService.user.is_staff">
      <td><button class="btn btn-info" (click)="register(rec.id)">Зарегистрировать</button> </td> 
      <td><button class="btn btn-warning" (click)="deny(rec.id)">Отклонить</button> </td> 
      </div>
    </tr>
    </tbody>
    </table>

<nav>
  <ul class="pagination justify-content-center">
    <li class="page-item" *ngFor="let rec of reqs | personp:person.person_id | worktypep:worktype.worktype  | datepipe:date.dateOne:date.dateTwo;let i=index">
        <span *ngIf="(i / limit + 1) == pagenum*1.0" class="page-item active" (click)="page(i/limit - i%limit + 1)">
            <button class="page-link">{{ i / limit  - i % limit + 1 }}</button></span>
        <span *ngIf="(i / limit + 1) != pagenum*1.0 && (i%limit) == 0" class="page-item " (click)="page(i/limit - i%limit + 1)">
            <button class="page-link">{{ i / limit  - i % limit + 1 }}</button></span>
    </li>
  </ul>
</nav>
<!-- <nav> -->
<!--   <ul class="pagination justify-content-center"> -->
<!--     <li class="page-item" *ngFor="let num of numPages"> -->
<!--         <span *ngIf="num == pagenum" class="page-item active" (click)="page(num)"> -->
<!--             <button class="page-link">{{ num }}</button></span> -->
<!--         <span *ngIf="num != pagenum" class="page-item " (click)="page(num)"> -->
<!--             <button class="page-link">{{ num }}</button></span> -->
<!--     </li> -->
<!--   </ul> -->
<!-- </nav> -->

<div class="text-center ">
    <button *ngIf="total > limit" class='btn btn d-none' (click)="more()">Ещё</button>
    <button class='btn btn' (click)="viewAll()">Показать все</button>
</div>

   </div>
   <messages #msg></messages>
   `,
    providers: [HttpService],
})


export class AcceptedComponent implements OnInit { 
  
    reqs: Array<Overs>;
    @ViewChild('msg') msg: MessagesComponent;
    dateTitleFrom: string = Strings.dateTitleFrom;
    dateTitleTo: string = Strings.dateTitleTo;
    @ViewChild('date') date: DoubleDateComponent;

    static LIMIT: number = 10;
    limit: number = 10;
    offset: number = 0;
    total: number;
    atPage: number = 10;
    pages: number = 1;
    pagenum: number = 1;
    numPages: Array<number>;


    constructor(private httpService: HttpService,
                private userService: UserService){}
     
    ngOnInit(){
        this.refresh();
    }

    refresh() {
        this.httpService.getRest('accepted', '0', '0').subscribe(
        (data: Response) => {
            this.reqs=data.json()['data'];
            this.total=parseInt(data.json()['total']);
            Util.makeIntervalTitles(this.reqs); // TODO make pipe?
            this.date.dateOne = Util.getMinDateStr(this.reqs);
            this.date.dateTwo = Util.getMaxDateStr(this.reqs);
            // Pagination.
            this.pages = Math.ceil(this.total / this.atPage);
            this.numPages = Array(this.pages).fill(0).map((x: any, i: any) => i + 1);
        });
    }

    page(n: number) {
        this.offset = this.atPage * (n - 1);
        this.pagenum = n;
        this.limit = AcceptedComponent.LIMIT;
        this.refresh();
    }

    more() {
        this.limit += 10;
        this.refresh();
    }

    viewAll() {
        this.limit = 0;
        this.offset = 0;
        this.refresh();
        this.limit = this.total;
    }

    remove(id: number) {
        let idx = -1;
        this.reqs.map((e, i) => {if (e.id == id) { idx = i; }});
        if (idx >= 0) {
            this.reqs.splice(idx, 1);
        }
    }

    deny(id: number){
        this.httpService.action('deny', id)
            .subscribe((data) => {
                this.msg.send("Отклонена заявка #" + id);
            });
                this.remove(id);
    }

    register(id: number){
        this.httpService.action('register', id)
            .subscribe((data) => {
                this.msg.send("заявка #" + id + " зарегистрирована");
            });
                this.remove(id);
    }
}
