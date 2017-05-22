import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpModule } from '@angular/http';
import { HttpService} from './http.service';
import { ViewChild } from '@angular/core';
import { MessagesComponent } from './messages.component';
import {Router} from '@angular/router';
import { UserService} from './user.service';

@Component({
    selector: 'my-app',
    template: `
    <div class='users'>
    <h4> Вход </h4>
    <form action="." method="post">

    <div class='form_input'>
    Имя пользователя (логин):
    <input class="form-control" placeholder="Username" type=text  [(ngModel)]="id_username" name="id_username">
    </div>
    <div class='form_input'>
    Пароль
    <input class="form-control" placeholder="password" type=password [(ngModel)]="password" name="password">
    </div>
    
    <div class='form_input'>
    <input class='btn btn-primary form-control' type=submit name=submit (click)=register() value='Войти'>
    </div>
    </form>
    <messages #msg></messages>
    </div>
   `,
    providers: [HttpService],
})


export class LoginComponent implements OnInit { 
  
    @ViewChild('msg') msg: MessagesComponent;
    id_username: string = '';
    password: string = '';
    user: any = {};

    constructor(private httpService: HttpService,
        private router: Router,
        private userService: UserService){}
    ngOnInit(){}
     
    register() {
        this.msg.clear();
        if (!this.id_username) {
            this.msg.send("Не введено имя пользователя.");
            return;
        }
        if (!this.password) {
            this.msg.send("Необходимо ввести пароль");
            return;
        }
        this.msg.send("Пробую войти...");
        this.user.username = this.id_username;
        this.user.password = this.password;
        this.httpService.postData(this.user, '/login/').subscribe(
            (data: Response) => {
                if (data.text() == 'not') {
                    this.msg.send("Не подходит логин/пароль");
                    return;
                } else if (data.text() == 'ok') {
                    this.msg.send("Успешно");
                    this.router.navigateByUrl('sum');
                    this.userService.update();
                    return;
                } else {
                    this.msg.send("Какая то ошибка ¯\_(-_-)_/¯");
                    this.msg.send(data.text());
                }
            });
    }

}
