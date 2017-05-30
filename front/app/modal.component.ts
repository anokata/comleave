import { Component, OnInit, Input } from '@angular/core';
import {Injectable} from '@angular/core';
import { UserService} from './user.service';
import { HttpService} from './http.service';

@Component({
    selector: 'modal',
    template: `
<button type="button" (click)="show()" class="btn btn-danger" data-toggle="modal" data-target="#exampleModal">
  {{ caption }}
</button>

<div class="modal fade" id="Modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">{{ title }}</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        {{ body }}
      </div>
      <div class="modal-footer">
        <button type="button" (click)="hide()" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
        <button type="button" (click)="act()" class="btn btn-primary">Ok</button>
      </div>
    </div>
  </div>
</div>
               `,
})


export class ModalComponent implements OnInit { 
  
    modal: any;
    @Input() title: string = 'title';
    @Input() caption: string = 'caption';
    @Input() body: string = 'body';
    //@Input() action: () => any;
    @Input() action: any;

    constructor(private httpService: HttpService) {}
                
     
    ngOnInit(){
        this.modal = $('#Modal');
    }

    show() {
        this.modal.modal('show');
    }

    hide() {
        this.modal.modal('hide');
    }

    act() {
        if (this.action) {
            this.action.action();
        }
        this.hide();
    }

}
