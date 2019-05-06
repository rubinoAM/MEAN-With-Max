import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector:'app-header',
    templateUrl:'./header.component.html',
    styleUrls:['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy{
    isAuth:boolean = false;
    private authListener: Subscription;

    constructor(private authService:AuthService){}

    ngOnInit(){
        this.authListener = this.authService.getAuthStatus()
            .subscribe(isAuth => {
                this.isAuth = isAuth;
            });
    }

    onLogout(){
        this.authService.logout();
    }

    ngOnDestroy(){
        this.authListener.unsubscribe();
    }
}