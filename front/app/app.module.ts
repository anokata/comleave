import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { RouterModule }   from '@angular/router';

import { AppComponent }  from './app.component';
import { SummaryComponent }  from './summary.component';
import { RegistredComponent }  from './registred.component';
import { PresentComponent }  from './present.component';

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
        ])
    
    ],
    declarations: [ AppComponent, SummaryComponent, RegistredComponent,
        PresentComponent],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }

