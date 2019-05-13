import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { AuthData } from '../models/auth-data.model';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + "auth";

@Injectable({ providedIn:'root' })
export class AuthService{
    private token:string;
    private authStatus = new Subject<boolean>();
    private tokenTimer:any;
    private userId:string;
    private isAuth:boolean = false;

    constructor(private http:HttpClient, private router:Router){}

    getToken(){
        return this.token;
    }

    getUserId(){
        return this.userId;
    }

    getIsAuth(){
        return this.isAuth;
    }

    getAuthStatus(){
        return this.authStatus.asObservable();
    }

    createUser(email:string,password:string){
        const authData:AuthData = {email:email,password:password};
        return this.http
            .post(BACKEND_URL + "/signup",authData)
            .subscribe(resp => {
                this.router.navigate(['/']);
            }, err => {
                this.authStatus.next(false);
            })
    }

    login(email:string,password:string){
        const authData:AuthData = {email:email,password:password};
        this.http
            .post<{token:string,expiresIn:number,userId:string}>(BACKEND_URL + "/login",authData)
            .subscribe(resp => {
                const token = resp.token;
                this.token = token;
                if(token){
                    const expiresIn = resp.expiresIn;
                    this.setAuthTimer(expiresIn);
                    this.userId = resp.userId;
                    this.isAuth = true;
                    this.authStatus.next(true);
                    const now = new Date();
                    const expDate = new Date(now.getTime() + expiresIn * 1000);
                    this.saveAuthData(token,expDate,this.userId);
                    this.router.navigate(['/']);
                }
            }, err => {
                this.authStatus.next(false);
            })
    }

    autoAuthUser(){
        const authData = this.getAuthData();
        if(!authData){
            return;
        }
        const now = new Date();
        const isInFuture = authData.expDate.getTime() - now.getTime();
        if(isInFuture > 0){
            this.token = authData.token;
            this.userId = authData.userId;
            this.isAuth = true;
            this.setAuthTimer(isInFuture/1000);
            this.authStatus.next(true);
        }
    }

    logout(){
        this.token = null;
        this.userId = null;
        this.isAuth = false;
        this.authStatus.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(['/']);
    }

    private setAuthTimer(duration:number){
        this.tokenTimer = setTimeout(()=>{
            this.logout();
        },duration * 1000);
    }

    private saveAuthData(token:string,expirationDate:Date,userId:string){
        localStorage.setItem('token',token);
        localStorage.setItem('expDate',expirationDate.toISOString());
        localStorage.setItem('userId',userId);
    }

    private clearAuthData(){
        localStorage.removeItem('token');
        localStorage.removeItem('expDate');
        localStorage.removeItem('userId');
    }

    private getAuthData(){
        const token = localStorage.getItem('token');
        const expDate = localStorage.getItem('expDate');
        const userId = localStorage.getItem('userId');
        if(!token || !expDate){
            return;
        }
        return{
            token:token,
            expDate: new Date(expDate),
            userId:userId,
        }
    }
}