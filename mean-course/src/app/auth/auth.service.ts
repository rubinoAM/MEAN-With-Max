import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthData } from '../models/auth-data.model';

@Injectable({ providedIn:'root' })
export class AuthService{
    constructor(private http:HttpClient){}

    createUser(email:string,password:string){
        const authData:AuthData = {email:email,password:password};
        this.http.post("http://localhost:4201/api/auth/signup",authData)
            .subscribe(resp => {
                console.log(resp)
            })
    }

    login(email:string,password:string){
        const authData:AuthData = {email:email,password:password};
        this.http.post("http://localhost:4201/api/auth/login",authData)
            .subscribe(resp => {
                console.log(resp)
            })
    }
}