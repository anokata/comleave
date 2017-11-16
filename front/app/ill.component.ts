import { Component, OnInit } from '@angular/core';
import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import { HttpModule } from '@angular/http';
import { HttpService} from './http.service';
import { Person } from './person';
import { Interval } from './interval';
import {ViewChild} from '@angular/core';
import { MessagesComponent } from './messages.component';
import { UserService} from './user.service';
import { Util } from './util';
import { DatepickerComponent} from './datepicker.component';

@Component({
    selector: 'my-app',
    template: `
    <div class='users-c' *ngIf="userService.user.is_authenticated">
    <h4>Регистрация больничного</h4>

    <div class='container'> <div class='row justify-content-center'>

  <div *ngIf="userService.user.is_staff">
    <div class='col'>Сотрудник: 
    <select class='form-control' [(ngModel)]="person_id">
        <option *ngFor="let person of persons" [value]="person.id">
            {{person.name}}
        </option>
    </select>
    </div>
  </div>

    <div class='col-md-2 form-group'>
    <datepicker #date [title]="dateTitle"></datepicker>
    </div>

    <div class='col-md-2 form-group'>
    <label>Срок:
    <select class='form-control' [(ngModel)]="interval">
        <option *ngFor="let opt of intervals" [value]="opt.value">
        {{opt.title}}
        </option>
    </select></label>
    </div>

    <div class='form_margin form-control'>Комментарий: <input class='form-control w100' type=text [(ngModel)]="comment"> </div>
    </div>
    </div>



    <button class="mt-3 btn btn-primary" (click)="register()">Зарегистрировать больничный</button>
    </div>
    <div class='users-c h5' *ngIf="!userService.user.is_authenticated">
    Вы не авторизованы для данной операции.
    </div>
    <messages #msg></messages>
    `,
    providers: [HttpService],
})


export class IllComponent implements OnInit { 
  
    comment: string = '-';
    interval: number = 60 * 24;
    person_id: number;
    intervals: Interval[];
    persons: Person[];
    login: string = '';
    @ViewChild('msg') msg: MessagesComponent;
    dateTitle: string = 'Дата:';
    @ViewChild('date') date: DatepickerComponent;
     
    constructor(private httpService: HttpService,
                private userService: UserService){}

     
    ngOnInit(){
        this.comment = '';
        this.login = this.userService.user.username;
        
        this.intervals = Array();
        var day: number = 60*24;
        for (let i = day; i <= day * 30; i += day) {
            this.intervals.push(new Interval(i, 'days'));
        }

        this.httpService.getData().subscribe(
            (data: Response) => {
                this.persons=data.json();
                this.person_id = this.persons[0].id;
                this.persons.forEach((e: Person) => {
                    if (e.login == this.login) {
                        this.person_id = e.id;
                    }
                });
                return this.persons;
            });
    }

    register() {
        this.httpService.register_udwork(this.date.date, this.interval, 
            this.person_id, this.comment, false, 'I')
            .subscribe((data) => { 
                if (data.text() != 'ok') {
                    this.msg.send("Ошибка: " + data.text());
                } else {
                    this.msg.send("Зарегистрирован больничный");
                }
            });
    }
}

