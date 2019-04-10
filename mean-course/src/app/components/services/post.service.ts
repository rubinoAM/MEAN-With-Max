import { Injectable } from '@angular/core';

import { Post } from '../../models/post.model';

@Injectable({providedIn:'root'})

export class PostService{
    private posts:Post[]=[];

    getPosts(){
        return [...this.posts];
    }

    addPost(post:Post){
        this.posts.push(post);
    }
}