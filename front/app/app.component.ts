import { Component, OnInit } from '@angular/core';
import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import { HttpModule } from '@angular/http';
import { HttpService} from './http.service';

@Component({
    selector: 'my-app',
    template: `
        <nav>
          <a routerLink="/sum" routerLinkActive="active">Summmary</a>
          <a routerLink="/reg" routerLinkActive="active">Registred</a>
          <a routerLink="/sent" routerLinkActive="active">Add new reg</a>
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
