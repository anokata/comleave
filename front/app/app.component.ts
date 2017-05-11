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
    start_date: Date;
    interval: number;
    status: string;
    comment: string;
    person: Person;
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
                    Users: 
                <li *ngFor="let p of user">
                  <span>{{p.name}}</span> 
                </li>
                    overs: 
                <li *ngFor="let p of overs">
                  <span>{{p.reg_date}}</span> 
                  <span>{{p.person}}</span> 
                  <span>{{p.status}}</span> 
                </li>
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
               </div>`,
    providers: [HttpService]
})

export class AppComponent implements OnInit { 
  
    user: Person;
    overs: Overs;
    sums: Summarize;
     
    constructor(private httpService: HttpService){}
     
    ngOnInit(){
        this.httpService.getData().subscribe(
            (data: Response) => {
                //console.log(data.json());
                return this.user=data.json();
            });
         
        this.httpService.getOvers().subscribe(
        (data: Response) => {
            this.overs=data.json();
            //let person = this.http.get(this.overs.person);
            }
        );

        this.httpService.getSum().subscribe(
        (data: Response) => {
            this.sums=data.json();
            this.sums.map((e) => e.total = e.overwork - e.unwork);
        });
    }
}
