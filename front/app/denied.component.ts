import { Component, OnInit } from '@angular/core';
import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import { HttpModule } from '@angular/http';
import { UserService} from './user.service';
import { HttpService} from './http.service';
import { Person } from './person';
import { Overs } from './overs';
import {ViewChild} from '@angular/core';
import { MessagesComponent } from './messages.component';
import { Util } from './util';
import { DoubleDateComponent} from './doubledate.component';
import { Strings } from './strings';
import { ModalComponent } from './modal.component';
import { Filter } from './filter';
import { WorktypeComponent } from './worktype.component';
import { PersonsComponent } from './persons.component';
import { Type } from './type';

@Component({
    selector: 'my-app',
    template: `
    <div class='container'> <div class='row justify-content-center'>
        <persons #person></persons>
        <worktypes #worktype></worktypes>
        <doubledate #date [titleOne]="dateTitleFrom" 
        [titleTwo]="dateTitleTo"></doubledate>
        <div class='col-md-5 form-group'> 
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
    </thead>
    <tbody>
    <tr *ngFor="let rec of reqs | personp:person.person_id | worktypep:worktype.worktype  | datepipe:date.dateOne:date.dateTwo">
      <td>{{rec.name}}</td> 
      <td *ngIf="rec.is_over">Переработка</td>
      <td *ngIf="!rec.is_over">Отгул</td>
      <td>{{rec.start_date | date:"dd.MM.yyyy"}}</td> 
      <td>{{rec.interval_str}}</td> 
      <td class='comment'>{{rec.comment}}</td> 
      <td>{{rec.reg_date | date:"HH:MM dd.MM.yyyy"}}</td> 
      <div *ngIf="userService.user.is_staff">
      <td><button class="btn btn-info" (click)="accept(rec.id)">Принять</button> </td> 
      <td><button class="btn btn-info" (click)="register(rec.id)">Зарегистрировать</button> </td> 
      <td><button class="btn btn-danger" (click)="delete(rec.id)">Удалить</button> </td> 
      </div>
    </tr>
    </tbody>
    </table>
   </div>

<div class="text-center">
    <button class='btn btn' (click)="more()">Ещё</button>
    <button class='btn btn' (click)="viewAll()">Показать все</button>
</div>

   <messages #msg></messages>
   `,
    providers: [HttpService],
})


export class DeniedComponent implements OnInit { 
  
    reqs: Array<Overs>;
    @ViewChild('msg') msg: MessagesComponent;
    dateTitleFrom: string = Strings.dateTitleFrom;
    dateTitleTo: string = Strings.dateTitleTo;
    @ViewChild('date') date: DoubleDateComponent;
    @ViewChild('worktype') worktype: WorktypeComponent;
    @ViewChild('person') person: PersonsComponent;
    limit: number = 10;

    modalCaption: string = 'Удалить все';
    modalTitle: string = 'Подвердите удаление';
    modalBody: string = 'Все отображенные заявки будут удалены.';
    modalAct: any;

    constructor(private httpService: HttpService,
                private userService: UserService){}
     
    ngOnInit(){
        this.refresh();
        this.modalAct = this;
    }

    refresh() {
        this.httpService.getRest('denied', this.limit.toString()).subscribe(
        (data: Response) => {
            this.reqs=data.json();
            Util.makeIntervalTitles(this.reqs);
            this.date.dateOne = Util.getMinDateStr(this.reqs);
            this.date.dateTwo = Util.getMaxDateStr(this.reqs);
        });
    }

    action() {
        let filter = new Filter(
            "/delete_orders/",
            this.date.dateOne,
            this.date.dateTwo,
            this.worktype.worktype,
            this.person.person_id
        );
        this.httpService.postFilter(filter).subscribe(
            (data: Response) => {
                console.log(data.text());
                console.log('end del');
            });
    }

    more() {
        this.limit += 10;
        this.refresh();
    }

    viewAll() {
        this.limit = 0;
        this.refresh();
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
            .subscribe((data) => {
                this.msg.send("Принята заявка #" + id);
            });
                this.remove(id);
    }

    register(id: number){
        this.httpService.action('register', id)
            .subscribe((data) => {
                this.msg.send("Зарегистрирована заявка #" + id);
            });
                this.remove(id);
    }

    delete(id: number){
        this.httpService.action('delete', id)
            .subscribe((data) => {
                this.msg.send("Удалена заявка #" + id);
            
            });
                this.remove(id);
    }
}
