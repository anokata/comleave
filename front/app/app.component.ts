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
          <a routerLink="/sent" routerLinkActive="active">Заререстрировать переработку</a>
          <a routerLink="/downwork" routerLinkActive="active">Заререстрировать отгул</a>
        </nav>
        <router-outlet></router-outlet>
               `,
    providers: [HttpService],
})


export class AppComponent implements OnInit { 
  
    constructor(private httpService: HttpService){}
     
    ngOnInit(){
    }

}
