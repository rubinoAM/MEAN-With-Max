import { Component} from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
    templateUrl:'./signup.component.html',
    styleUrls:['./signup.component.css']
})

export class SignupComponent {
    spinner:boolean = false;

    constructor(public authService:AuthService){}

    onSignup(form:NgForm){
        if(!form.invalid){
            this.spinner = true;
            this.authService.createUser(form.value.email,form.value.password)
                .subscribe(null, err => {this.spinner = false;});
        }
    }
}