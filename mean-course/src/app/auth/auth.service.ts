import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthData } from '../models/auth-data.model';

@Injectable({ providedIn:'root' })
export class AuthService{
    private token:string;

    constructor(private http:HttpClient){}

    getToken(){
        return this.token;
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
            })
    }
}