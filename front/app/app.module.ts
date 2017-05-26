import { NgModule }      from '@angular/core';
//import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { RouterModule }   from '@angular/router';
import { ModuleWithProviders, Optional, SkipSelf } from '@angular/core';
import { XSRFStrategy, CookieXSRFStrategy } from '@angular/http';

import { AppComponent }  from './app.component';
import { SummaryComponent }  from './summary.component';
import { RegistredComponent }  from './registred.component';
import { DeniedComponent }  from './denied.component';
import { AcceptedComponent }  from './accepted.component';
import { PresentComponent }  from './present.component';
import { DownworkComponent }  from './downwork.component';
import { MessagesComponent }  from './messages.component';
import { RegistrationComponent }  from './registration.component';
import { LoginComponent }  from './login.component';
import { UpdateComponent }  from './update.component';
import { RestorePwdComponent }  from './restore-pwd.component';
import { PersonsComponent }  from './persons.component';
import { WorktypeComponent }  from './worktype.component';
import { PersonPipe }  from './person.pipe';
import { WorktypePipe }  from './worktype.pipe';
import { DatePipe }  from './date.pipe';
import { DatepickerComponent }  from './datepicker.component';
import { DoubleDateComponent }  from './doubledate.component';
import { OrderComponent }  from './order.component';
import { OrderEditComponent }  from './order-edit.component';

import { UserService} from './user.service';
import { HttpService} from './http.service';


@NgModule({
    imports:      [ BrowserModule, FormsModule, HttpModule,
        RouterModule.forRoot([
          {
            path: 'main',
            component: AppComponent
          },
          {
            path: 'sum',
            component: SummaryComponent
          },
          {
            path: 'reg',
            component: RegistredComponent
          },
          {
            path: 'sent',
            component: PresentComponent
          },
          {
            path: 'downwork',
            component: DownworkComponent
          },
          {
            path: 'denied',
            component: DeniedComponent
          },
          {
            path: 'accepted',
            component: AcceptedComponent
          },
          {
            path: 'register',
            component: RegistrationComponent
          },
          {
            path: 'update',
            component: UpdateComponent
          },
          {
            path: 'login',
            component: LoginComponent
          },
          {
            path: 'restore',
            component: RestorePwdComponent
          },
          {
            path: 'edit/:id',
            component: OrderEditComponent,
          },
            //NgbModule.forRoot()
        ])
    
    ],
    declarations: [ AppComponent, SummaryComponent, RegistredComponent,
        PresentComponent, DownworkComponent, DeniedComponent, 
        AcceptedComponent, MessagesComponent, RegistrationComponent, 
        UpdateComponent, LoginComponent, RestorePwdComponent, PersonsComponent,
        PersonPipe, WorktypeComponent, WorktypePipe, DatepickerComponent,
        DatePipe, DoubleDateComponent, OrderComponent, OrderEditComponent],
    bootstrap:    [ AppComponent ],
    providers: [
        {
            provide: XSRFStrategy,
            useValue: new CookieXSRFStrategy('csrftoken', 'X-CSRFToken')
        },
        UserService, HttpService
    ],

})
export class AppModule { }

