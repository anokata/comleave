import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpModule } from '@angular/http';
import { HttpService} from './http.service';
import { ViewChild } from '@angular/core';
import { MessagesComponent } from './messages.component';

@Component({
    selector: 'my-app',
    template: `
    <div class='users'>
    <h4> Регистрация пользователя </h4>
    <form action="." method="post">

    <div class='form_input'>
    Имя пользователя (логин):
    <input type=text  [(ngModel)]="id_username" name="id_username">
    </div>
    <div class='form_input'>
    Пароль
    <input type=password [(ngModel)]="password1" name="password1">
    </div>
    <div class='form_input'>
    Повторите пароль
    <input type=password [(ngModel)]="password2" name="password2">
    </div>

    <div class='form_input'>
    Имя: 
    <input type=text [(ngModel)]="first_name" name="first_name">
    </div>
    <div class='form_input'>
    Фамилия: 
    <input type=text [(ngModel)]="last_name" name="last_name">
    </div>
    <div class='form_input'>
    Email: 
    <input type=text [(ngModel)]="email" name="email">
    </div>

    <div class='form_input'>
    <input type=submit name=submit (click)=register() value='Зарегестрировать'>
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

    constructor(private httpService: HttpService){}
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
    }

}
