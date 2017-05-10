import { Component, OnInit } from '@angular/core';
import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import { HttpModule } from '@angular/http';
import { HttpService} from './http.service';

export class Person{
    name: string;
    is_manager: boolean;
}

@Component({
    selector: 'my-app',
    template: `<div>
                    <p>users: 
                <li *ngFor="let p of user">
                  <span>{{p.name}}</span> 
                </li>
                    </p>
               </div>`,
    providers: [HttpService]
})

export class AppComponent implements OnInit { 
  
    user: Person;
     
    constructor(private httpService: HttpService){}
     
    ngOnInit(){
        this.httpService.getData().subscribe(
            (data: Response) => {
                console.log(data.json());
                return this.user=data.json();
            });
         
    }
}
