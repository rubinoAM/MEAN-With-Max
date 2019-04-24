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

    getPost(id:string){
        return { ...this.posts.find(p => p.id === id) };
    }

    addPost(post:Post){
        this.http.post<{message:string,postId:string}>('http://localhost:4201/api/posts',post)
            .subscribe((resData)=>{
                const id = resData.postId;
                post.id = id;
                this.posts.push(post);
                this.postsUpdated.next([...this.posts]);
            });
    }

    updatePost(id:string,title:string,content:string){
        const updatedPost:Post = {
            id:id,
            title:title,
            content:content
        }
        this.http.put("http://localhost:4201/api/posts/" + id,updatedPost)
            .subscribe((resp)=>{
                const updatedPosts = [...this.posts];
                const oldPostIndex = updatedPosts.findIndex(p => p.id === updatedPost.id);
                updatedPosts[oldPostIndex] = updatedPost;
                this.posts = updatedPosts;
                this.postsUpdated.next([...this.posts]);
            });
    }

    deletePost(postId:string){
        console.log(postId);
        this.http.delete(`http://localhost:4201/api/posts/${postId}`)
            .subscribe(()=>{
                console.log(this.posts);
                const updatedPosts = this.posts.filter(post => {
                    if(post.id !== postId){return post};
                });
                this.posts = updatedPosts;
                this.postsUpdated.next([...this.posts]);
            })
    }
}