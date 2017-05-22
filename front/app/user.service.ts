import { HttpService} from './http.service';
import {Injectable} from '@angular/core';
import { User } from './user';
import {Response} from '@angular/http';


@Injectable()
export class UserService {
    public user: User;

    constructor(private httpService: HttpService) {
        this.user = new User();
    }

    update():User {
        this.httpService.getUser().subscribe(
            (data: Response) => {
                this.user = data.json();
            });
        return this.user;
    }
}
