import { Component, OnInit } from '@angular/core';
import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import { HttpModule } from '@angular/http';
import { HttpService} from './http.service';
import { Person } from './person';
import { Overs } from './overs';

@Component({
    selector: 'my-app',
    template: `
    <div class='users'>
    <table>
    <thead>
    <th>ФИО</th>
    <th>Тип</th>
    <th>Дата начала</th>
    <th>Срок</th>
    <th>Коментарий</th>
    <th>Дата регистрации заявки</th>
    </thead>
    <tbody>
    <tr *ngFor="let rec of reqs">
      <td>{{rec.name}}</td> 
      <td *ngIf="rec.is_over">Переработка</td>
      <td *ngIf="!rec.is_over">Отгул</td>
      <td>{{rec.start}}</td> 
      <td>{{rec.interval}}</td> 
      <td>{{rec.comment}}</td> 
      <td>{{rec.reg_date}}</td> 
      <td><button class="btn" (click)="register(rec.id)">Зарегестрировать</button> </td> 
      <td><button class="btn" (click)="deny(rec.id)">Отклонить</button> </td> 
    </tr>
    </tbody>
    </table>
   </div>
   <div class='messages users'>
    <div *ngFor="let msg of messages">
        {{msg}}
    </div>
   </div>
   `,
    providers: [HttpService],
})


export class AcceptedComponent implements OnInit { 
  
    reqs: Array<Overs>;
    messages: string[];

    constructor(private httpService: HttpService){}
     
    ngOnInit(){
        this.messages = Array();

        this.httpService.getRest('accepted').subscribe(
        (data: Response) => {
            this.reqs=data.json();
            this.reqs.map((e:Overs) => {
                e.start = new Date(e.start_date)['toLocaleFormat']('%d.%m.%Y');
                return e;
            });
        });
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
                this.messages.push("Отклонена заявка #" + id);
            });
                this.remove(id);
    }

    register(id: number){
        this.httpService.action('register', id)
            .subscribe((data) => {
                this.messages.push("заявка #" + id + " зарегестрирована");
            });
                this.remove(id);
    }
}
