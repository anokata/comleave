import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import { HttpModule } from '@angular/http';
 
@Injectable()
export class HttpService{
    host = '';
 
    constructor(private http: Http){ }
     
    getData() {
        return this.http.get(this.host + 'persons/');
    }

    getSum() {
        return this.http.get(this.host + 'summarize/');
    }

    getReqs() {
        return this.http.get(this.host + 'registred/');
    }

    getRest(req: string) {
        return this.http.get(this.host + req + '/');
    }

    getUrl(url: string) {
        return this.http.get(url);
    }

    action(action: string, id: number) {
        return this.http.get(this.host + action + '/' + id.toString());
    }

    actionAccept(id: number, new_interval: number = 0) {
        return this.http.get(this.host + '/accept/' + id.toString() + '/' +
            new_interval);
    }

    register_overwork(date: string, interval: number, 
        person_id: number, comment: string) {
        if (!comment) {
            comment = '-';
        }
        return this.http.get(this.host + '/register_overwork/' + 
            date + '/' + 
            interval + '/' + 
            person_id + '/' + 
            comment + '/' );
    }

    register_unwork(date: string, interval: number, 
        person_id: number, comment: string) {
        if (!comment) {
            comment = '-';
        }
        return this.http.get(this.host + '/register_unwork/' + 
            date + '/' + 
            interval + '/' + 
            person_id + '/' + 
            comment + '/' );
    }
}
