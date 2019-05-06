import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { AuthData } from '../models/auth-data.model';

@Injectable({ providedIn:'root' })
export class AuthService{
    private token:string;
    private authStatus = new Subject<boolean>();
    private tokenTimer:any;
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
        this.http.post<{token:string,expiresIn:number}>("http://localhost:4201/api/auth/login",authData)
            .subscribe(resp => {
                const token = resp.token;
                this.token = token;
                if(token){
                    const expiresIn = resp.expiresIn;
                    this.tokenTimer = setTimeout(()=>{
                        this.logout();
                    },expiresIn * 1000);
                    this.isAuth = true;
                    this.authStatus.next(true);
                    const now = new Date();
                    const expDate = new Date(now.getTime() + expiresIn * 1000);
                    this.saveAuthData(token,expDate);
                    this.router.navigate(['/']);
                }
            })
    }

    logout(){
        this.token = null;
        this.isAuth = false;
        this.authStatus.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(['/']);
    }

    private saveAuthData(token:string,expirationDate:Date){
        localStorage.setItem('token',token);
        localStorage.setItem('expDate',expirationDate.toISOString());
    }

    private clearAuthData(){
        localStorage.removeItem('token');
        localStorage.removeItem('expDate');
    }
}