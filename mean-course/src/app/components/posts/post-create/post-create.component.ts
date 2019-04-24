import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Post } from '../../../models/post.model';
import { PostService } from 'src/app/components/services/post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
    selector:'app-post-create',
    templateUrl:'./post-create.component.html',
    styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit{
    enteredTitle:string="";
    enteredContent:string="";
    private mode:string="create";
    private postId:string;
    private post:Post;

    constructor(public postService: PostService, public route: ActivatedRoute){}

    ngOnInit(){
        this.route.paramMap.subscribe((paramMap:ParamMap)=>{
            if(paramMap.has('id')){
                this.mode = 'edit';
                this.postId = paramMap.get('id');
                this.post = this.postService.getPost(this.postId);
            } else {
                this.mode = 'create';
                this.postId = null;
            }
        });
    }

    savePost(form:NgForm){
        if(!form.invalid){
            const post:Post = {
                id:null,
                title:form.value.title,
                content:form.value.content,
            };
            this.postService.addPost(post);
            form.resetForm();
        }
    }
}