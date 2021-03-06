import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { mimeType } from './mime-type.validator';
import { Post } from '../../../models/post.model';
import { PostService } from 'src/app/components/services/post.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector:'app-post-create',
    templateUrl:'./post-create.component.html',
    styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit, OnDestroy{
    enteredTitle:string="";
    enteredContent:string="";
    post:Post;
    spinner:boolean = false;
    form:FormGroup;
    imagePreview:string;
    private mode:string="create";
    private postId:string;
    private authStatus:Subscription;

    constructor(
        public postService: PostService,
        public route: ActivatedRoute,
        public authService: AuthService
    ){}

    ngOnInit(){
        this.authStatus = this.authService.getAuthStatus().subscribe(
            authState => {
                this.spinner = false;
            }
        );
        this.form = new FormGroup({
            'title':new FormControl(null, {
                validators:[Validators.required, Validators.minLength(3)]
            }),
            'content':new FormControl(null, {
                validators:[Validators.required]
            }),
            'image':new FormControl(null,{
                validators:[Validators.required],
                asyncValidators:[mimeType]
            })
        });
        this.route.paramMap.subscribe((paramMap:ParamMap)=>{
            if(paramMap.has('id')){
                this.mode = 'edit';
                this.postId = paramMap.get('id');
                this.spinner = true;
                this.postService.getPost(this.postId).subscribe(postData=>{
                    this.spinner = false;
                    this.post = {
                        id:postData._id,
                        title:postData.title,
                        content:postData.content,
                        imagePath:postData.imagePath,
                        creator:postData.creator,
                    }
                    this.form.setValue({
                        'title':this.post.title,
                        'content':this.post.content,
                        'image':this.post.imagePath,
                    });
                });
            } else {
                this.mode = 'create';
                this.postId = null;
            }
        });
    }

    pickImage(e:Event){
        const file = (e.target as HTMLInputElement).files[0];
        this.form.patchValue({image:file});
        this.form.get('image').updateValueAndValidity();
        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = String(reader.result);
        }
        reader.readAsDataURL(file);
    }

    savePost(){
        if(!this.form.invalid){
            const newPost:Post = {
                id:null,
                title:this.form.value.title,
                content:this.form.value.content,
                imagePath:this.form.value.image,
                creator:null,
            };
            this.spinner = true;
            if(this.mode === 'create'){
                this.postService.addPost(newPost,this.form.value.image);
            } else if (this.mode === 'edit'){
                this.postService.updatePost(
                    this.postId,
                    this.form.value.title,
                    this.form.value.content,
                    this.form.value.image,
                );
            }
            this.form.reset();
        }
    }

    ngOnDestroy(){
        this.authStatus.unsubscribe();
    }
}