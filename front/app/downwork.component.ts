import { Component, OnInit } from '@angular/core';
import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import { HttpModule } from '@angular/http';
import { HttpService} from './http.service';
import { Person } from './person';
import { Interval } from './interval';
import {ViewChild} from '@angular/core';
import { MessagesComponent } from './messages.component';

@Component({
    selector: 'my-app',
    template: `
    <div class='users'>
    <h4>Регистрация отгула </h4>
    <div class='form_margin'>Дата: <input type="text" id="datepicker" [(ngModel)]="date">
    Срок:
    <select [(ngModel)]="interval">
        <option *ngFor="let opt of intervals" [value]="opt.value">
        {{opt.title}}
        </option>
    </select>
    </div>
    <div class='form_margin'>Комментарий: <input class='w100' type=text [(ngModel)]="comment"> </div>
    <div class='form_margin'>Сотрудник: 
    <select [(ngModel)]="person_id">
        <option *ngFor="let person of persons" [value]="person.id">
            {{person.name}}
        </option>
    </select>
    </div>
    <button class="btn" (click)="register()">Зарегестрировать отгул</button>
    </div>
    <messages #msg></messages>
    `,
    providers: [HttpService],
})


export class DownworkComponent implements OnInit { 
  
    comment: string = '-';
    interval: number = 60;
    date: string = '01.01.2000';
    person_id: number;
    intervals: Interval[];
    persons: Person;
    @ViewChild('msg') msg: MessagesComponent;
     
    constructor(private httpService: HttpService){}
     
    ngOnInit(){
        let datep: any;
        datep = $("#datepicker");
        datep.datepicker();
        this.comment = '';
        
        this.intervals = Array();
        for (let i = 60; i < 60 * 24; i += 30) {
            this.intervals.push(new Interval(i));
        }

        this.httpService.getData().subscribe(
            (data: Response) => {
                this.persons=data.json();
                this.person_id = this.persons[0].id;
                return this.persons;
            });
    }

    register() {
        let datep: any;
        datep = $("#datepicker");
        this.date = datep.val().replace(/\//g, '.');;
        this.httpService.register_unwork(this.date, this.interval, 
            this.person_id, this.comment)
            .subscribe((data) => { 
                this.msg.send("Зарегестрирован отгул");
            });
    }
}

