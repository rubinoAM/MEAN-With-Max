import { NgModule } from '@angular/core';
import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from './post-list/post-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from 'src/app/app-routing.module';

@NgModule({
    declarations:[
        PostCreateComponent,
        PostListComponent
    ],
    imports:[
        CommonModule,
        AppRoutingModule,
        ReactiveFormsModule,
        AngularMaterialModule
    ]
})
export class PostsModule{}