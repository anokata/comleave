import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { RouterModule }   from '@angular/router';

import { AppComponent }  from './app.component';
import { SummaryComponent }  from './summary.component';

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
          }
        ])
    
    ],
    declarations: [ AppComponent, SummaryComponent],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }

