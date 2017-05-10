import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import { HttpModule } from '@angular/http';
 
@Injectable()
export class HttpService{
 
    constructor(private http: Http){ }
     
    getData(){
        return this.http.get('http://localhost:8000/persons/?format=json');
    }
}
