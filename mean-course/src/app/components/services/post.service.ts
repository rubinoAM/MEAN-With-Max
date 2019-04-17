import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from '../../models/post.model';

@Injectable({providedIn:'root'})

export class PostService{
    private posts:Post[]=[];
    private postsUpdated = new Subject<Post[]>();

    constructor(private http:HttpClient){}

    getPosts(){
        this.http.get<{message:string,posts:any}>('http://localhost:4201/api/posts')
            .pipe(map((postData)=>{
                return postData.posts.map((post)=>{
                    return {
                        title:post.title,
                        content:post.content,
                        id:post._id,
                    }
                })
            }))
            .subscribe((updatedPosts)=>{
                this.posts = updatedPosts;
                this.postsUpdated.next([...this.posts]);
            });
    }

    getPostUpdateListener(){
        return this.postsUpdated.asObservable();
    }

    addPost(post:Post){
        this.http.post<{message:string}>('http://localhost:4201/api/posts',post)
            .subscribe((resData)=>{
                console.log(resData.message);
                this.posts.push(post);
                this.postsUpdated.next([...this.posts]);
            });
    }

    deletePost(postId:string){
        this.http.delete('http://localhost:4201/api/posts/' + postId)
            .subscribe(()=>{
                console.log('DELETED')
            })
    }
}