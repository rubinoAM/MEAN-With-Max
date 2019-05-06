import { Component} from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
    templateUrl:'./login.component.html',
    styleUrls:['./login.component.css']
})

export class LoginComponent {
    spinner:boolean = false;

    constructor(public authService:AuthService){}

    onLogin(form:NgForm){
        if(!form.invalid){
            this.spinner = true;
            this.authService.login(form.value.email,form.value.password);
        }
    }
}