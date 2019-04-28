import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Post } from '../../../models/post.model';
import { PostService } from 'src/app/components/services/post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';

@Component({
    selector:'app-post-create',
    templateUrl:'./post-create.component.html',
    styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit{
    enteredTitle:string="";
    enteredContent:string="";
    post:Post;
    spinner:boolean = false;
    form:FormGroup;
    imagePreview:string;
    private mode:string="create";
    private postId:string;

    constructor(
        public postService: PostService,
        public route: ActivatedRoute
    ){}

    ngOnInit(){
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
                        content:postData.content
                    }
                    this.form.setValue({
                        'title':this.post.title,
                        'content':this.post.content
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
            };
            this.spinner = true;
            if(this.mode === 'create'){
                this.postService.addPost(newPost);
            } else if (this.mode === 'edit'){
                this.postService.updatePost(
                    this.postId,
                    this.form.value.title,
                    this.form.value.content
                );
            }
            this.form.reset();
        }
    }
}