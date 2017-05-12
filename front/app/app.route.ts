import { provideRouter, RouterConfig } from '@angular/router';
import {AppComponent} from "./app.component";
import {SummaryComponent} from "./summary.component";

const routes: RouterConfig = [
	{ path: '',redirectTo: '/app',pathMatch: 'full'},
  { path: 'app', component: AppComponent },
  { path: 'sum', component: SummaryComponent },
];

export const appRouterProviders = [
  provideRouter(routes)
];

