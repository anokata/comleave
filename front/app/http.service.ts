import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import { HttpModule } from '@angular/http';
 
@Injectable()
export class HttpService{
 
    constructor(private http: Http){ }
     
    getData() {
        return this.http.get('http://localhost:8000/persons/?format=json');
    }

    getOvers() {
        return this.http.get('http://localhost:8000/overs/?format=json');
    }

    getSum() {
        return this.http.get('http://localhost:8000/sum/?format=json');
    }

    getReqs() {
        return this.http.get('http://localhost:8000/reqs/?format=json');
    }

    getUrl(url: string) {
        return this.http.get(url);
    }

    postAccep(id: number) {
        //TODO
    }
}
