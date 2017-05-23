import { Component, OnInit } from '@angular/core';
import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import { HttpModule } from '@angular/http';
import { HttpService} from './http.service';
import { UserService} from './user.service';
import { User } from './user';
import {Router} from '@angular/router';

@Component({
    selector: 'my-app',
    template: `
    <h4>Hello {{ userService.user.first_name }} aka {{ userService.user.username }} </h4>
    <nav class="navbar navbar-inverse bg-primary navbar-toggleable-md navbar-light bg-faded">
 <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item ">
  <a class="nav-link"  routerLink="/sum" routerLinkActive="active">Сводка</a> </li>
      <li class="nav-item">
  <a class="nav-link"  routerLink="/reg" routerLinkActive="active">Зарегестрированные</a> </li>
      <li class="nav-item">
  <a class="nav-link"  routerLink="/denied" routerLinkActive="active">Отклонённые</a> </li>
    <li class="nav-item">
  <a class="nav-link"  routerLink="/accepted" routerLinkActive="active">Принятые</a>
    </li>
  <span class='nav-content' *ngIf="userService.user.is_authenticated"> 
    <li class="nav-item">
      <a class="nav-link"  routerLink="/sent" routerLinkActive="active">Зарегестрировать переработку</a>
    </li>
    <li class="nav-item">
      <a class="nav-link"  routerLink="/downwork" routerLinkActive="active">Зарегестрировать отгул</a>
    </li>
    </span>

      <span class='nav-content' *ngIf="!userService.user.is_authenticated"> 
<li class="nav-item">
          <a class="nav-link" routerLink="/login" routerLinkActive="active">Войти</a>
    </li>
    <li class="nav-item">
          <a class="nav-link" routerLink="/register" routerLinkActive="active">Зарегестрироватся</a>
    </li>
      </span>
      <span class='nav-content' *ngIf="userService.user.is_authenticated"> 
    <li class="nav-item">
          <div class='nav-link my-nav-btn' (click)=logout()>Выйти</div>
    </li>
    <li class="nav-item">
          <a class="nav-link" routerLink="/update" routerLinkActive="active">Обновить</a>
    </li>
          </span>
    </ul>
  </div>
        </nav>
        <router-outlet></router-outlet>
               `,
    providers: [HttpService],
})


export class AppComponent implements OnInit { 
  
    constructor(private httpService: HttpService,
                private userService: UserService,
                private router: Router){}
     
    ngOnInit(){
        this.userService.update();
    }

    logout() {
        this.httpService.getUrl('logout/').subscribe(
            (data: Response) => {
                this.userService.update();
                this.router.navigateByUrl('login');
            });
    }

}
