import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Post } from '../../models/post.model';
import { PostService } from 'src/app/components/services/post.service';

@Component({
    selector:'app-post-create',
    templateUrl:'./post-create.component.html',
    styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent{
    enteredTitle:string="";
    enteredContent:string="";

    constructor(public postService: PostService){}

    savePost(form:NgForm){
        if(!form.invalid){
            const post:Post = {
                title:form.value.title,
                content:form.value.content,
            };
            this.postService.addPost(post);
        }
    }
}