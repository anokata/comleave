import { Component, OnInit, Input } from '@angular/core';
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
import { Type } from './type';
import { DatepickerComponent} from './datepicker.component';

@Component({
    selector: 'order',
    template: `
<div class='users-c' *ngIf="userService.user.is_authenticated">
<h4> {{ title }}</h4>

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
<datepicker #date [title]="dateTitle" [inDate]="inDate"></datepicker>
</div>

<div class='col-md-2 form-group'>
<label>Срок:
<select class='form-control' [(ngModel)]="inInterval">
    <option *ngFor="let opt of intervals" [value]="opt.value">
    {{opt.title}}
    </option>
</select></label>
</div>

<div class='col-md-2 form-group'>
<label>Тип:
<select class='form-control' [(ngModel)]="inType">
    <option *ngFor="let opt of types" [value]="opt.value">
    {{opt.title}}
    </option>
</select></label>
</div>

<div class='form_margin form-control'>Комментарий: <input class='form-control w100' type=text [(ngModel)]="inComment"> </div>
</div>
</div>

<button class="mt-3 btn btn-primary" (click)="register()">{{ buttonTitle }}</button>
</div>

<div class='users-c h5' *ngIf="!userService.user.is_authenticated">
Вы не авторизованы для данной операции.
</div>
<messages #msg></messages>
   `,
    providers: [HttpService],
})


export class OrderComponent implements OnInit { 
  
    @Input() title: string;
    @Input() buttonTitle: string;
    @Input() inDate: string;
    @Input() inInterval: number;
    @Input() inComment: string;
    @Input() inAction: string;
    @Input() inId: number;
    @Input() inType: number;

    comment: string = '-';
    type: number = 1;
    interval: number = 60;
    person_id: number;
    intervals: Interval[];
    types: Type[];
    persons: Person[];
    login: string = '';
    @ViewChild('msg') msg: MessagesComponent;
    dateTitle: string = 'Дата:';
    @ViewChild('date') date: DatepickerComponent;
     
    constructor(private httpService: HttpService,
                private userService: UserService){}
     
    ngOnInit(){
        this.comment = this.inComment;
        this.login = this.userService.user.username;

        this.types = Array();
        this.types.push(new Type(Type.UNDER, 'Отгул'));
        this.types.push(new Type(Type.OVER, 'Переработка'));
        this.types.push(new Type(Type.ILL, 'Больничный'));

        if (this.inType) {
            this.type = this.inType;
        } else {
            this.inType = this.type;
        }

        this.intervals = Array();
        if (this.type == Type.ILL) {
            let day = 60 * 24;
            for (let i = day; i <= day * 30; i += day) {
                this.intervals.push(new Interval(i));
            }
        } else {
            for (let i = 60; i <= 60 * 24; i += 30) {
                this.intervals.push(new Interval(i));
            }
        }
        
        if (this.inInterval) {
            this.interval = this.inInterval;
        }
        if (this.inDate) {
            this.date.date = this.inDate;
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

    setDate(sdate: string) {
        this.date.date = sdate;
    }

    register() {
        let date = Util.dateStrToStr(this.date.date);
        let is_over = this.inType == Type.OVER ? 'True' : '';
        let kind: string = this.inType.toString();
        if (this.inType == Type.ILL) {
            kind = 'I';
        } else {
            kind = undefined;
        }
        console.log(kind);
        this.httpService.register(this.inAction, date, this.inInterval, 
            this.person_id, this.inComment, this.inId, is_over, kind)
            .subscribe((data) => { 
                if (data.text() != 'ok') {
                    this.msg.send("Ошибка: " + data.text());
                    this.msg.send(data.text());
                } else {
                    this.msg.send("Успешно отредактировано");
                }
            });
    }
}

