import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'messages',
    template: `
   <div class='messages users'>
    <div *ngFor="let msg of messages">
        {{msg}}
    </div>
   </div>
   `,
})
export class MessagesComponent implements OnInit { 
  
    messages: string[];

    constructor(){}
     
    ngOnInit(){
        this.messages = Array();
    }

    public send(msg: string) {
        this.messages.push(msg);
    }
}
