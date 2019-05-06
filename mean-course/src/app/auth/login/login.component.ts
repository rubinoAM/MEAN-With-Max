import { Component, OnInit, OnDestroy} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
    templateUrl:'./login.component.html',
    styleUrls:['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy{
    spinner:boolean = false;
    private authSub: Subscription;

    constructor(public authService:AuthService){}

    ngOnInit(){
        this.authSub = this.authService.getAuthStatus().subscribe(
            authStatus => {
                this.spinner = false;
            }
        );
    }

    onLogin(form:NgForm){
        if(!form.invalid){
            this.spinner = true;
            this.authService.login(form.value.email,form.value.password);
        }
    }

    ngOnDestroy(){
        this.authSub.unsubscribe();
    }
}