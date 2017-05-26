import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpModule } from '@angular/http';
import { HttpService} from './http.service';
import { UserService} from './user.service';

export class Summarize {
    name: string;
    unwork: number;
    overwork: number;
    total: number;
}

@Component({
    selector: 'my-app',
    template: `
    <div class='container'> <div class='row justify-content-center'>
        <persons #person [default_name]="def_name"></persons>
    </div> </div>

    <div class='users table-responsive'>
    <table class="table table-striped table-hover table-sm">
    <thead class="thead-inverse">
    <th>ФИО</th>
    <th>Отгул</th>
    <th>Переработка</th>
    <th>Итог</th>
    </thead>
    <tbody>
    <tr *ngFor="let rec of sums | personp:person.person_id">
      <td class=""> {{rec.name}} ({{rec.login}})</td> 
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
    def_name: string = '';

    constructor(private httpService: HttpService,
                private userService: UserService){}
     
    ngOnInit(){

        this.httpService.getSum().subscribe(
        (data: Response) => {
            this.sums=data.json();
            this.sums.map((e:Summarize) => e.total = e.overwork - e.unwork);
        });
        if (!this.userService.user.is_staff) {
            this.def_name = this.userService.user.username;
        }
    }
}

