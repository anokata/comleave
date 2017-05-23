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
    <div class='container'>
    <div class='row justify-content-center'><div class='col-4 form_input from-group'>
    <h4 class='text-center'> Регистрация пользователя </h4>
    </div></div>

    <form action="." method="post">

    <div class='row justify-content-center'><div class='col-4 mt-3 from-group'>
    <label for='username'>Имя пользователя</label>
    <input id='username' class="form-control" placeholder="login" type=text  [(ngModel)]="id_username" name="id_username">
    </div>
    </div>

    <div class='row justify-content-center'><div class='col-4 mt-3 from-group'>
    Пароль
    <input class="form-control" placeholder="password" type=password [(ngModel)]="password1" name="password1">
    </div>
    </div>

    <div class='row justify-content-center'><div class='col-4 mt-3 from-group'>
    Повторите пароль
    <input class="form-control" placeholder="password again" type=password [(ngModel)]="password2" name="password2">
    </div>
    </div>

    <div class='row justify-content-center'><div class='col-4 mt-3 from-group'>
    Имя 
    <input class="form-control" placeholder="First name" type=text [(ngModel)]="first_name" name="first_name">
    </div>
    </div>

    <div class='row justify-content-center'><div class='col-4 mt-3 from-group'>
    Фамилия 
    <input class="form-control" placeholder="Last name" type=text [(ngModel)]="last_name" name="last_name">
    </div>
    </div>

    <div class='row justify-content-center'><div class='col-4 mt-3 from-group'>
    Email 
    <input class="form-control" placeholder="Email" type=text [(ngModel)]="email" name="email">
    </div>
    </div>

    <div class='row justify-content-center'><div class='col-4 mt-3 from-group'>
    <input class="form-control btn btn-primary" type=submit name=submit (click)=register() value='Зарегестрировать'>
    </div>
    </div>

    </form>
    <messages #msg></messages>
    </div>
   `,
    providers: [HttpService],
})


export class RegistrationComponent implements OnInit { 
  
    @ViewChild('msg') msg: MessagesComponent;
    id_username: string = '';
    password1: string = '';
    password2: string = '';
    first_name: string = '';
    last_name: string = '';
    email: string = '';
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
        if (!this.password1) {
            this.msg.send("Необходимо ввести пароль");
            return;
        }
        if (this.password1 !== this.password2) {
            this.msg.send("Пароли не совпадают");
            this.password1 = '';
            this.password2 = '';
            return;
        }
        this.msg.send("Пробую зарегестрировать...");
        this.user.username = this.id_username;
        this.user.password = this.password1;
        this.user.first_name = this.first_name;
        this.user.last_name = this.last_name;
        this.user.email = this.email;
        this.httpService.postData(this.user, '/register_user/').subscribe(
            (data: Response) => {
                if (data.text() == 'exist') {
                    this.msg.send("Пользователь уже существует");
                    return;
                }
                if (data.text() == 'not') {
                    this.msg.send("Какая то ошибка ¯\_(-_-)_/¯");
                    this.msg.send(data.text());
                    return;
                }
                if (data.text() == 'ok') {
                    this.msg.send("Успешно");
                    this.userService.update();
                    this.router.navigateByUrl('sum');
                    return;
                }
            });
    }

}
