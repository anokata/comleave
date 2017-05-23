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
    <h4> Восстановление пароля </h4>
    <form action="." method="post">
    <p>Укажите или логин или email</p>
    <div class='form_input'>
    Имя пользователя (логин):
    <input class="form-control" placeholder="Username" type=text  [(ngModel)]="id_username" name="id_username">
    </div>
    <div class='form_input'>
    Пароль
    <input class="form-control" placeholder="email" type=text [(ngModel)]="email" name="email">
    </div>
    
    <div class='form_input'>
    <input class='btn btn-primary form-control' type=submit name=submit (click)=restore() value='Восстановить'>
    </div>
    </form>
    <messages #msg></messages>
    </div>
   `,
    providers: [HttpService],
})


export class RestorePwdComponent implements OnInit { 
  
    @ViewChild('msg') msg: MessagesComponent;
    id_username: string = '';
    email: string = '';
    user: any = {};

    constructor(private httpService: HttpService,
        private router: Router,
        private userService: UserService){}
    ngOnInit(){}
     
    restore() {
        this.msg.clear();
        if (!this.id_username && !this.email) {
            this.msg.send("Не введено ни имя пользователя ни email.");
            return;
        }
        this.msg.send("Пробую восстановить...");
        this.user.username = this.id_username;
        this.user.email = this.email;
        this.httpService.postData(this.user, '/restore/').subscribe(
            (data: Response) => {
                if (data.text() == 'not') {
                    this.msg.send("нет таких данных");
                    return;
                } else if (data.text() == 'ok') {
                    this.msg.send("Успешно восстановлен пароль, проверьте почту");
                    this.router.navigateByUrl('login');
                    return;
                } else {
                    this.msg.send("Какая то ошибка ¯\_(-_-)_/¯");
                    this.msg.send(data.text());
                }
            });
    }

}
