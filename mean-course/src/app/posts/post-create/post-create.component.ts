import { Component } from '@angular/core';

@Component({
    selector:'app-post-create',
    templateUrl:'./post-create.component.html',
})

export class PostCreateComponent{
    post:string="";

    savePost(newPost:string){
        this.post = newPost;
    }
}