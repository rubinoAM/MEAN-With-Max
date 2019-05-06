import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { AuthData } from '../models/auth-data.model';

@Injectable({ providedIn:'root' })
export class AuthService{
    private token:string;
    private authStatus = new Subject<boolean>();
    private isAuth:boolean = false;

    constructor(private http:HttpClient, private router:Router){}

    getToken(){
        return this.token;
    }

    getIsAuth(){
        return this.isAuth;
    }

    getAuthStatus(){
        return this.authStatus.asObservable();
    }

    createUser(email:string,password:string){
        const authData:AuthData = {email:email,password:password};
        this.http.post("http://localhost:4201/api/auth/signup",authData)
            .subscribe(resp => {
                console.log(resp)
            })
    }

    login(email:string,password:string){
        const authData:AuthData = {email:email,password:password};
        this.http.post<{token:string}>("http://localhost:4201/api/auth/login",authData)
            .subscribe(resp => {
                const token = resp.token;
                this.token = token;
                if(token){
                    this.isAuth = true;
                    this.authStatus.next(true);
                    this.router.navigate(['/']);
                }
            })
    }

    logout(){
        this.token = null;
        this.isAuth = false;
        this.authStatus.next(false);
        this.router.navigate(['/']);
    }
}