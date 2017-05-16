import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import { HttpModule } from '@angular/http';
 
@Injectable()
export class HttpService{
    host = 'http://localhost:8000/';
    base = 'rest';
    prefix = this.host + this.base;
 
    constructor(private http: Http){ }
     
    getData() {
        return this.http.get(this.host + 'persons/');
    }

    getOvers() {
        return this.http.get(this.prefix + '/overs/?format=json');
    }

    getSum() {
        return this.http.get(this.prefix + '/sum/?format=json');
    }

    getReqs() {
        return this.http.get(this.prefix + '/reqs/?format=json');
    }

    getRest(req: string) {
        return this.http.get(this.prefix + '/' + req + '/?format=json');
    }

    getUrl(url: string) {
        return this.http.get(url);
    }

    action(action: string, id: number) {
        return this.http.get('http://localhost:8000/' + action + '/' + id.toString());
    }

    actionAccept(id: number, new_interval: number = 0) {
        return this.http.get('http://localhost:8000/accept/' + id.toString() + '/' +
            new_interval);
    }

    register_overwork(date: string, interval: number, 
        person_id: number, comment: string) {
        return this.http.get('http://localhost:8000/register_overwork/' + 
            date + '/' + 
            interval + '/' + 
            person_id + '/' + 
            comment + '/' );
    }

    register_unwork(date: string, interval: number, 
        person_id: number, comment: string) {
        return this.http.get('http://localhost:8000/register_unwork/' + 
            date + '/' + 
            interval + '/' + 
            person_id + '/' + 
            comment + '/' );
    }
}
