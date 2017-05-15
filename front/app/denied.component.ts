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
      <td><button class="btn" (click)="accept(rec.id)">Принять</button> </td> 
      <td><button class="btn" (click)="deny(rec.id)">Отклонить</button> </td> 
    </tr>
    </tbody>
    </table>
               </div>`,
    providers: [HttpService],
})


export class DeniedComponent implements OnInit { 
  
    reqs: Array<Overs>;

    constructor(private httpService: HttpService){}
     
    ngOnInit(){
        this.httpService.getReqs().subscribe(
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

    accept(id: number){
        this.httpService.actionAccept(id)
                .subscribe((data) => {console.log('sended');});
                this.remove(id);
    }

    deny(id: number){
        this.httpService.action('deny', id)
                .subscribe((data) => {console.log('sended');});
                this.remove(id);
    }
}
