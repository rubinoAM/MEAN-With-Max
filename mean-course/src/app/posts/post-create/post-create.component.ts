import { Component, EventEmitter, Output } from '@angular/core';
import { Post } from '../../models/post.model';

@Component({
    selector:'app-post-create',
    templateUrl:'./post-create.component.html',
    styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent{
    enteredTitle:string="";
    enteredContent:string="";
    @Output() postCreated = new EventEmitter<Post>();

    savePost(){
        const post:Post = {
            title:this.enteredTitle,
            content:this.enteredContent,
        };
        this.postCreated.emit(post);
    }
}