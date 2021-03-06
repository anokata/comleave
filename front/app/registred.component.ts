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
import { Filter } from './filter';
import { Type } from './type';
import { WorkType } from './worktype';
import { ModalComponent } from './modal.component';

@Component({
    selector: 'my-app',
    template: `

<div class='container'> <div class='row justify-content-center'>
    <persons #person></persons>
    <worktypes #worktype></worktypes>
    <doubledate #date [titleOne]="dateTitleFrom" 
    [titleTwo]="dateTitleTo"></doubledate>
        <div class='col-md-5 form-group' *ngIf="userService.user.is_staff"> 
        <modal #modal
            [title]="modalTitle"
            [caption]="modalCaption"
            [body]="modalBody"
            [action]="modalAct"
        ></modal>
        </div>
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
    <tr *ngFor="let rec of reqs | personp:person.person_id | worktypep:worktype.worktype  | datepipe:date.dateOne:date.dateTwo ;let i=index" >
    <td *ngIf="i>=offset && i < offset + limit ">{{rec.name}}</td> 
    <td *ngIf="i>=offset && i < offset + limit && rec.is_over && rec.kind == 'O'">Переработка</td>
    <td *ngIf="i>=offset && i < offset + limit && !rec.is_over && rec.kind == 'O'">Отгул</td>
    <td *ngIf="i>=offset && i < offset + limit && rec.kind == 'I'">Больничный</td>
    <td *ngIf="i>=offset && i < offset + limit">{{rec.start_date | date:"dd.MM.yyyy"}}</td> 
    <td *ngIf="i>=offset && i < offset + limit">{{rec.interval_str}} </td> 
    <td *ngIf="i>=offset && i < offset + limit" class='comment'>{{rec.comment}}</td> 
    <td *ngIf="i>=offset && i < offset + limit">{{rec.reg_date | date:"HH:mm dd.MM.yyyy"}}</td> 
    <div class="text-right d-inline" *ngIf="i>=offset && i < offset + limit && userService.user.is_staff">
      <td class="d-inline"><button class="btn btn-info m5" (click)="accept(rec.id)">Принять</button> </td> 
      <td class="d-inline"><button class="btn btn-warning m5" (click)="deny(rec.id)">Отклонить</button> </td> 
    </div>

    <div class="text-right d-inline" *ngIf="i>=offset && i < offset + limit && (userService.user.username == rec.login) || (userService.user.is_staff) ">
<td *ngIf="i>=offset && i < offset + limit " class="d-inline">
  <button class="btn btn-danger m5" (click)="edit(rec.id)">Редактировать</button> 
  <button class="btn btn-danger m5" (click)="delete(rec.id)">Удалить</button> 
</td> 
  </div>

</tr>
</tbody>
</table>

<nav>
  <ul class="pagination justify-content-center">
    <li class="page-item" *ngFor="let num of numPages">
        <span *ngIf="num == pagenum" class="page-item active" (click)="page(num)">
            <button class="page-link">{{ num }}</button></span>
        <span *ngIf="num != pagenum" class="page-item " (click)="page(num)">
            <button class="page-link">{{ num }}</button></span>
    </li>
  </ul>
</nav>


<div class="text-center">
    <button *ngIf="total > limit" class='btn btn d-none' (click)="more()">Еще</button>
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
    @ViewChild('worktype') worktype: WorktypeComponent;
    @ViewChild('person') person: PersonsComponent;

    static LIMIT: number = 10;
    limit: number = 10;
    offset: number = 0;
    total: number;
    atPage: number = 10;
    pages: number = 1;
    pagenum: number = 1;
    numPages: Array<number>;

    modalCaption: string = 'Удалить все';
    modalTitle: string = 'Подвердите удаление';
    modalBody: string = 'Все отображенные заявки будут удалены.';
    modalAct: any;

    constructor(private httpService: HttpService,
                private router: Router,
                private userService: UserService){}
     
    ngOnInit(){

        this.intervals = Array();
        for (let i = 60; i <= 60 * 24; i += 30) {
            this.intervals.push(new Interval(i));
        }
        // for delete
        this.modalAct = this;
        this.refresh();

    }

    action() {
        let filter = new Filter(
            "/delete_orders/",
            this.date.dateOne,
            this.date.dateTwo,
            this.worktype.worktype,
            "R",
            this.person.person_id
        );
        this.httpService.postFilter(filter).subscribe(
            (data: Response) => {
                this.limit = RegistredComponent.LIMIT;
                this.offset = 0;
                this.refresh();
            });
    }

    refresh() {
        this.httpService.getReqs(0, '0').subscribe(
        (data: Response) => {
            this.reqs=data.json()['data'];
            this.total=parseInt(data.json()['total']);
            Util.makeIntervalTitles(this.reqs);
            this.date.dateOne = Util.getMinDateStr(this.reqs);
            this.date.dateTwo = Util.getMaxDateStr(this.reqs);
            // Pagination.
            this.pages = Math.ceil(this.total / this.atPage);
            this.numPages = Array(this.pages).fill(0).map((x: any, i: any) => i + 1);

            /*
        let filter = new Filter(
            "/registred/",
            this.date.dateOne,
            this.date.dateTwo,
            this.worktype.worktype || WorkType.ALL,
            "R",
            this.person.person_id || -1,
            this.limit,
            this.offset,
        );
        this.httpService.postFilter(filter).subscribe(
            (data: Response) => {
                //console.log(data);
                //this.refresh();
            });
             */
        });

    }

    page(n: number) {
        this.offset = this.atPage * (n - 1);
        this.pagenum = n;
        this.limit = RegistredComponent.LIMIT;
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

    delete(id: number) {
        this.httpService.action('delete', id)
            .subscribe((data) => {
                this.msg.send("Удалена заявка #" + id);
                this.remove(id);
        });
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
