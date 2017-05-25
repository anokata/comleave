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
    <th>ФИО</th>
    <th>Тип</th>
    <th>Дата начала</th>
    <th>Срок</th>
    <th>Коментарий</th>
    <th>Дата регистрации заявки</th>
    </thead>
    <tbody>
    <tr *ngFor="let rec of reqs | personp:person.person_id | worktypep:worktype.worktype  | datepipe:date.dateOne:date.dateTwo">
      <td>{{rec.name}}</td> 
      <td *ngIf="rec.is_over">Переработка</td>
      <td *ngIf="!rec.is_over">Отгул</td>
      <td>{{rec.start_date | date:"dd.MM.yyyy"}}</td> 
      <td>{{rec.interval}}</td> 
      <td class='comment'>{{rec.comment}}</td> 
      <td>{{rec.reg_date | date:"HH:MM dd.MM.yyyy"}}</td> 
      <div *ngIf="userService.user.is_staff">
      <td><button class="btn btn-info" (click)="accept(rec.id)">Принять</button> </td> 
      <td><button class="btn btn-info" (click)="register(rec.id)">Зарегестрировать</button> </td> 
      <td><button class="btn btn-danger" (click)="delete(rec.id)">Удалить</button> </td> 
      </div>
    </tr>
    </tbody>
    </table>
   </div>
   <messages #msg></messages>
   `,
    providers: [HttpService],
})


export class DeniedComponent implements OnInit { 
  
    reqs: Array<Overs>;
    @ViewChild('msg') msg: MessagesComponent;
    dateTitleFrom: string = 'С';
    dateTitleTo: string = 'По';
    @ViewChild('date') date: DoubleDateComponent;

    constructor(private httpService: HttpService,
                private userService: UserService){}
     
    ngOnInit(){
        this.httpService.getRest('denied').subscribe(
        (data: Response) => {
            this.reqs=data.json();
            this.date.dateOne = Util.getMinDateStr(this.reqs);
            this.date.dateTwo = Util.getMaxDateStr(this.reqs);
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
            .subscribe((data) => {
                this.msg.send("Принята заявка #" + id);
            });
                this.remove(id);
    }

    register(id: number){
        this.httpService.action('register', id)
            .subscribe((data) => {
                this.msg.send("Зарегестрирована заявка #" + id);
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
