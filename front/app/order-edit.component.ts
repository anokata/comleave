import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { OrderComponent } from './order.component';
import { HttpService} from './http.service';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { Overs } from './overs';
import { Response } from '@angular/http';
import { Util } from './util';
import {ViewChild} from '@angular/core';
import { Type } from './type';

@Component({
    selector: 'oapp',
    template: `
<order #order 
       [title]="title"
       [buttonTitle]="buttonTitle"
       [inDate]="inDate"
       [inInterval]="inInterval"
       [inComment]="inComment"
       [inAction]="inAction"
       [inId]="inId"
       [inType]="inType"
></order>
   `,
})


export class OrderEditComponent implements OnInit { 
    title: string = 'Редактировать';
    buttonTitle: string = 'Применить';
    inDate: string;
    inInterval: number;
    inComment: string;
    inId: number;
    inType: number;
    inAction: string = '/order_edit/';
    @ViewChild('order') order: OrderComponent;
  
    constructor(private httpService: HttpService,
                private router: Router,
                private route: ActivatedRoute) {}

    ngOnInit(){
        let id:number = parseInt(this.route.snapshot.params['id']);
        this.inId = id;
        let over: Overs;
        this.httpService.action('over_by_id', id).subscribe(
            (data: Response) => {
                if (data.text() != 'not') {
                    over=data.json();
                    this.inDate = Util.dateToStr(new Date(over.start_date));
                    this.order.setDate(this.inDate);
                    this.inInterval = over.interval;
                    this.inComment = over.comment;
                    if (over.is_over && over.kind == 'O') {
                        this.inType = Type.OVER;
                    } else if (!over.is_over && over.kind == 'O') {
                        this.inType = Type.UNDER;
                    } else {
                        this.inType = Type.ILL;
                    }
                } else {
                    console.log('no');
                }
            });
    }
     
}
