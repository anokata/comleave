import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'messages',
    template: `
   <div class='messages users'>
    <div *ngFor="let msg of messages" class="alert alert-success" role="alert">
        {{msg}}
    </div>
   </div>
   `,
})
export class MessagesComponent implements OnInit { 
  
    messages: string[];

    constructor(){}
     
    ngOnInit(){
        this.clear();
    }

    public send(msg: string) {
        this.messages.push(msg);
    }

    public clear() {
        this.messages = Array();
    }
}
