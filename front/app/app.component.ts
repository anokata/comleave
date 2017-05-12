import { Component, OnInit } from '@angular/core';
import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import { HttpModule } from '@angular/http';
import { HttpService} from './http.service';

export class Person{
    name: string;
    is_manager: boolean;
}

export class Overs {
    reg_date: Date;
    start_date: string;
    interval: number;
    status: string;
    comment: string;
    person: Person;
    name: string;
    start: string;
    is_over: boolean;
    dework_type: string;
    id: number;
}

export class Summarize {
    name: string;
    unwork: number;
    overwork: number;
    total: number;
}

@Component({
    selector: 'my-app',
    template: `<div class='users'>
    <table>
    <thead>
    <th>ФИО</th>
    <th>Отгул</th>
    <th>Переработка</th>
    <th>Итог</th>
    </thead>
    <tbody>
    <tr *ngFor="let rec of sums">
      <td>{{rec.name}}</td> 
      <td>{{rec.unwork}}</td> 
      <td>{{rec.overwork}}</td> 
      <td>{{rec.total}}</td> 
    </tr>
    </tbody>
    </table>


    <table>
    <thead>
    <th>ФИО</th>
    <th>Тип</th>
    <th>Дата начала</th>
    <th>Часов</th>
    <th>Коментарий</th>
    <th>Дата регистрации заявки</th>
    </thead>
    <tbody>
    <tr *ngFor="let rec of reqs">
      <td>{{rec.name}}</td> 
      <td>{{rec.dework_type}}</td> 
      <td>{{rec.start}}</td> 
      <td>{{rec.interval}}</td> 
      <td>{{rec.comment}}</td> 
      <td>{{rec.reg_date}}</td> 
      <td>{{rec.id}} 
      <button class="btn" (click)="submit(rec.id)">Принять</button>
      </td> 
    </tr>
    </tbody>
    </table>
               </div>`,
    providers: [HttpService]
})

export class AppComponent implements OnInit { 
  
    user: Person;
    overs: Overs;
    sums: Array<Summarize>;
    reqs: Array<Overs>;
     
    constructor(private httpService: HttpService){}
     
    ngOnInit(){
        this.httpService.getData().subscribe(
            (data: Response) => {
                return this.user=data.json();
            });
         
        this.httpService.getOvers().subscribe(
        (data: Response) => {
            this.overs=data.json();
            }
        );

        this.httpService.getSum().subscribe(
        (data: Response) => {
            this.sums=data.json();
            this.sums.map((e:Summarize) => e.total = e.overwork - e.unwork);
        });

        this.httpService.getReqs().subscribe(
        (data: Response) => {
            this.reqs=data.json();
            this.reqs.map((e:Overs) => {
                e.start = new Date(e.start_date)['toLocaleFormat']('%d.%m.%Y');
                e.dework_type = e.is_over ? 'переработка' : 'отгул';
                return e;
            });
        });
    }

    submit(id: number){
        this.httpService.actionAccept(id)
                .subscribe((data) => {console.log('sended');});
    }
}
