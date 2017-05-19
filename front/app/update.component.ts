import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpModule } from '@angular/http';
import { HttpService} from './http.service';
import { ViewChild } from '@angular/core';
import { MessagesComponent } from './messages.component';
import {Router} from '@angular/router';

@Component({
    selector: 'my-app',
    template: `
    <div class='users'>
    <h4> Обновить  пользователя </h4>
    <form action="." method="post">

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
    <input type=submit name=submit (click)=update() value='Обновить'>
    </div>
    </form>
    <messages #msg></messages>
    </div>
   `,
    providers: [HttpService],
})


export class UpdateComponent implements OnInit { 
  
    @ViewChild('msg') msg: MessagesComponent;
    first_name: string = '';
    last_name: string = '';
    email: string = '';
    user: any = {};

    constructor(private httpService: HttpService,
        private router: Router){}
    ngOnInit(){
        this.httpService.getUser().subscribe(
            (data: Response) => {
                this.user = data.json();
                this.first_name = this.user.first_name;
                this.last_name = this.user.last_name;
                this.email = this.user.email;
            });
    }
     
    update() {
        this.msg.clear();
        this.user.first_name = this.first_name;
        this.user.last_name = this.last_name;
        this.user.email = this.email;
        this.httpService.postData(this.user, '/update/').subscribe(
            (data: Response) => {
                if (data.text() != 'ok') {
                    this.msg.send("Какая то ошибка ¯\_(-_-)_/¯");
                    this.msg.send(data.text());
                    return;
                }
                if (data.text() == 'ok') {
                    this.msg.send("Успешно");
                    this.router.navigateByUrl('sum');
                    return;
                }
            });
    }

}
