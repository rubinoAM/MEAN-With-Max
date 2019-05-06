import { Component, OnInit, OnDestroy} from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
    templateUrl:'./signup.component.html',
    styleUrls:['./signup.component.css']
})

export class SignupComponent implements OnInit, OnDestroy{
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

    onSignup(form:NgForm){
        if(!form.invalid){
            this.spinner = true;
            this.authService.createUser(form.value.email,form.value.password);
        }
    }

    ngOnDestroy(){
        this.authSub.unsubscribe();
    }
}