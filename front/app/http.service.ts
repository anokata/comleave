import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import { HttpModule } from '@angular/http';
import {Response, Headers, URLSearchParams} from '@angular/http';
import { User } from './user';
import { Filter } from './filter';
import { Util } from './util';
 
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

    getReqs(limit: number = 0, offset: string="") {
        if (offset == "") {
            return this.http.get(this.host + 'registred/' + limit.toString());
        } else {
            return this.http.get(this.host + 'registred/' + limit.toString() + '/' + offset);
        }
    }

    getRest(req: string, param: string="", offset: string="") {
        if (offset == "") {
            return this.http.get(this.host + req + '/' + param);
        } else {
            return this.http.get(this.host + req + '/' + param + '/' + offset);
        }
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

    register_udwork(date: string, interval: number, 
        person_id: number, comment: string, is_over: boolean, kind?: string) {
        if (!comment) {
            comment = '-';
        }
        if (!kind) {
            kind = 'O';
        }
        var params = new URLSearchParams();
        params.set('date', date);
        params.set('interval', interval.toString());
        params.set('person_id', person_id.toString());
        params.set('comment', comment);
        params.set('kind', kind);
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' }); 
        let action: string = is_over ? '/register_overwork/' : '/register_unwork/';
        return this.http.post(this.host + action,  params.toString(), { headers: headers });
    }

    register(action: string, date: string, interval: number, 
        person_id: number, comment: string, id:number, is_over:string) {
        if (!comment) {
            comment = '-';
        }
        var params = new URLSearchParams();
        params.set('date', date);
        params.set('id', id.toString());
        params.set('interval', interval.toString());
        params.set('person_id', person_id.toString());
        params.set('comment', comment);
        params.set('is_over', is_over);
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' }); 
        return this.http.post(this.host + action,  params.toString(), { headers: headers });
    }

    postFilter(obj: Filter){
        let params = new URLSearchParams();
        let action = obj['action'];
        params.set('date1', Util.dateStrToStr(obj.date1));
        params.set('date2', Util.dateStrToStr(obj.date2));
        params.set('type', obj.type.toString());
        params.set('person_id', obj.person_id.toString());
        params.set('status', obj.status);
        params.set('limit', obj.limit.toString());
        params.set('offset', obj.offset.toString());

        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' }); 
        console.log(action);
        console.log(params.toString());
        return this.http.post(this.host + action,  params.toString(), { headers: headers });
    }

    postData(obj: any, action: string){
        var params = new URLSearchParams();
        params.set('username', obj['username']);
        params.set('password', obj['password']);
        params.set('last_name', obj['last_name']);
        params.set('first_name', obj['first_name']);
        params.set('email', obj['email']);
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' }); 
        return this.http.post(this.host + action,  params.toString(), { headers: headers });
    }

    getUser() {
        return this.http.get(this.host + 'user' + '/');
    }
}
