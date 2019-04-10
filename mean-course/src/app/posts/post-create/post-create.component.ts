import { Component } from '@angular/core';

@Component({
    selector:'app-post-create',
    templateUrl:'./post-create.component.html',
    styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent{
    post:string="Type in some text above and save your post to overwrite this text.";
    enteredPost:string="";

    savePost(){
        this.post = this.enteredPost;
    }
}