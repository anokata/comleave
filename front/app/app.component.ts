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
    template: `<div>DDDD
                    <p>N: {{user?.name}}</p>
               </div>`,
    providers: [HttpService]
})

export class AppComponent implements OnInit { 
  
    user: Person;
     
    constructor(private httpService: HttpService){}
     
    ngOnInit(){
        console.log('get t');
         
        this.httpService.getData().subscribe(
            (data: Response) => {
                console.log('i: ' + data);
                console.log('j: ' + data.json());
                return this.user=data.json();
            });
        console.log('it: ' + this.user);
         
    }
}
