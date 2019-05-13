import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AngularMaterialModule } from '../angular-material.module';

@NgModule({
    declarations:[
        LoginComponent,
        SignupComponent
    ],
    imports:[
        AngularMaterialModule,
        FormsModule,
        CommonModule
    ]
})
export class AuthModule{}