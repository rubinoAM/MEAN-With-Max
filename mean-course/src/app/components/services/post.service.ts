import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Post } from '../../models/post.model';

@Injectable({providedIn:'root'})

export class PostService{
    private posts:Post[]=[];
    private postsUpdated = new Subject<Post[]>();

    constructor(private http:HttpClient){}

    getPosts(){
        this.http.get<{message:string,posts:Post[]}>('http://localhost:4201/api/posts')
            .subscribe((postData)=>{
                this.posts = postData.posts;
                this.postsUpdated.next([...this.posts]);
            });
        //return [...this.posts];
    }

    getPostUpdateListener(){
        return this.postsUpdated.asObservable();
    }

    addPost(post:Post){
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
    }
}