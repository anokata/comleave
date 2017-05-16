import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpModule } from '@angular/http';
import { HttpService} from './http.service';

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
      <td>{{rec.name}} ({{rec.login}})</td> 
      <td>{{rec.unwork}}</td> 
      <td>{{rec.overwork}}</td> 
      <td>{{rec.total}}</td> 
    </tr>
    </tbody>
    </table>
    </div>`,
    providers: [HttpService]
})


export class SummaryComponent implements OnInit { 
  
    sums: Array<Summarize>;

    constructor(private httpService: HttpService){}
     
    ngOnInit(){

        this.httpService.getSum().subscribe(
        (data: Response) => {
            this.sums=data.json();
            this.sums.map((e:Summarize) => e.total = e.overwork - e.unwork);
        });
    }
}

