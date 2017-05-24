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

@Component({
    selector: 'my-app',
    template: `
    <div class='users-c' *ngIf="userService.user.is_authenticated">
    <h4>Регистрация переработки </h4>
    <div class='form_margin form-group'>Дата: <input type="text" class="datepicker" [(ngModel)]="date">
    <label>Срок:
    <select class='form-control' [(ngModel)]="interval">
        <option *ngFor="let opt of intervals" [value]="opt.value">
        {{opt.title}}
        </option>
    </select></label>
    </div>
    <div class='form_margin form-control'>Комментарий: <input class='form-control w100' type=text [(ngModel)]="comment"> </div>

    <div class='form_margin'>Сотрудник: 
    <select class='form-control' [(ngModel)]="person_id">
        <option *ngFor="let person of persons" [value]="person.id">
            {{person.name}}
        </option>
    </select>
    </div>
    <button class="btn btn-primary" (click)="register_overwork()">Зарегестрировать переработку</button>
   </div>
    <div class='users-c h5' *ngIf="!userService.user.is_authenticated">
    Вы не авторизованы для данной операции.
    </div>
   <messages #msg></messages>
   `,
    providers: [HttpService],
})


export class PresentComponent implements OnInit { 
  
    comment: string = '-';
    interval: number = 60;
    date: string = '01.01.2000';
    person_id: number;
    intervals: Interval[];
    persons: Person[];
    login: string = '';
    @ViewChild('msg') msg: MessagesComponent;
     
    constructor(private httpService: HttpService,
                private userService: UserService){}
     
    ngOnInit(){
        this.comment = '';
        this.login = this.userService.user.username;
        this.date = Util.setupDate();
        
        this.intervals = Array();
        for (let i = 60; i < 60 * 24; i += 30) {
            this.intervals.push(new Interval(i));
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

    register_overwork() {
        let datep: any;
        datep = $("#datepicker");
        this.date = datep.val().replace(/\//g, '.');;
        this.httpService.register_overwork(this.date, this.interval, 
            this.person_id, this.comment)
            .subscribe((data) => { 
                if (data.text() != 'ok') {
                    this.msg.send("Ошибка");
                } else {
                    this.msg.send("Зарегестрирована переработка на " + this.interval 
                        + " минут ");
                }
            });
    }
}

