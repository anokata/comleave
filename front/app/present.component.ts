import { Component, OnInit } from '@angular/core';
import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import { HttpModule } from '@angular/http';
import { HttpService} from './http.service';

export class Person{
    name: string;
    is_manager: boolean;
    id: number;
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
    template: `
    <div class='users'>
    Дата: <input type="text" id="datepicker" >
    <br>
    Срок:
    <select [(ngModel)]="interval">
        <option *ngFor="let opt of intervals" [value]="opt.value">
        {{opt.title}}
        </option>
    </select>
    <br>
    Комментарий: <input type=text [(ngModel)]="comment">
    <br>
    <select [(ngModel)]="person_id">
        <option *ngFor="let person of persons" [value]="person.id">
            {{person.name}}
        </option>
    </select>
    <button class="btn" (click)="register_overwork()">Зарегестрировать</button>
               </div>`,
    providers: [HttpService],
})


export class PresentComponent implements OnInit { 
  
    comment: string;
    interval: number;
    date: string;
    person_id: number;
    intervals: Interval[];
    persons: Person;
     
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
                return this.persons=data.json();
            });
    }

    register_overwork() {
        let datep: any;
        datep = $("#datepicker");
        this.date = datep.val().replace(/\//g, '.');;
        this.httpService.register_overwork(this.date, this.interval, 
            this.person_id, this.comment)
            .subscribe((data) => { console.log('registred'); });
    }
}

