import { Component, OnInit } from '@angular/core';
import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import { HttpModule } from '@angular/http';
import { HttpService} from './http.service';
import { UserService} from './user.service';
import { User } from './user';

@Component({
    selector: 'my-app',
    template: `
    <h4>Hello {{ userService.user.username }} </h4>
        <nav>
          <a routerLink="/sum" routerLinkActive="active">Сводка</a>
          <a routerLink="/reg" routerLinkActive="active">Зарегестрированные</a>
          <a routerLink="/denied" routerLinkActive="active">Отклонённые</a>
          <a routerLink="/accepted" routerLinkActive="active">Принятые</a>
          <a routerLink="/sent" routerLinkActive="active">Зарегестрировать переработку</a>
          <a routerLink="/downwork" routerLinkActive="active">Зарегестрировать отгул</a>
          <div *ngIf="!userService.user.is_authenticated"> 
              <a routerLink="/login" routerLinkActive="active">Войти</a>
              <a routerLink="/register" routerLinkActive="active">Зарегестрироватся</a>
          </div>
          <div *ngIf="userService.user.is_authenticated"> 
              <a href="accounts/logout/">Выйти</a> 
              <a routerLink="/update" routerLinkActive="active">Обновить</a>
              </div>
        </nav>
        <router-outlet></router-outlet>
               `,
    providers: [HttpService],
})


export class AppComponent implements OnInit { 
  
    constructor(private httpService: HttpService,
                private userService: UserService){}
     
    ngOnInit(){
        this.userService.update();
    }

}
