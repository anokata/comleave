import { Component, OnInit } from '@angular/core';
import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import { HttpModule } from '@angular/http';
import { HttpService} from './http.service';

@Component({
    selector: 'my-app',
    template: `
        <nav>
          <a routerLink="/sum" routerLinkActive="active">Сводка</a>
          <a routerLink="/reg" routerLinkActive="active">Зарегестрированные</a>
          <a routerLink="/denied" routerLinkActive="active">Отклонённые</a>
          <a routerLink="/accepted" routerLinkActive="active">Принятые</a>
          <a routerLink="/sent" routerLinkActive="active">Зарегестрировать переработку</a>
          <a routerLink="/downwork" routerLinkActive="active">Зарегестрировать отгул</a>
          <div *ngIf="!is_logged"> <a href="accounts/login/">Login</a> </div>
          <div *ngIf="is_logged"> <a href="accounts/logout/">Logout</a> </div>
        </nav>
        <router-outlet></router-outlet>
               `,
    providers: [HttpService],
})


export class AppComponent implements OnInit { 
    is_logged: boolean;
  
    constructor(private httpService: HttpService){}
     
    ngOnInit(){
        this.is_logged = (<HTMLInputElement>document.getElementById('is_logged')).value == 'True';
    }

}
