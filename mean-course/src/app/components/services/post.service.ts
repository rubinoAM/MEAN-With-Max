import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Post } from '../../models/post.model';

@Injectable({providedIn:'root'})

export class PostService{
    private posts:Post[]=[];
    private postsUpdated = new Subject<Post[]>();

    constructor(private http:HttpClient, private router:Router){}

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
        return this.http.get<{_id:string, title:string, content:string}>('http://localhost:4201/api/posts/' + id);
    }

    addPost(post:Post,image:File){
        console.log(image, post);
        const postData = new FormData();
        postData.append("title",post.title);
        postData.append("content",post.content);
        postData.append('image',image,post.title);
        this.http.post<{message:string,postId:string}>('http://localhost:4201/api/posts',postData)
            .subscribe((resData)=>{
                const newPost:Post = {
                    id: resData.postId,
                    title:post.title,
                    content:post.content,
                }
                console.log(newPost);
                this.posts.push(newPost);
                this.postsUpdated.next([...this.posts]);
                this.router.navigate(['/']);
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
                this.router.navigate(['/']);
            });
    }

    deletePost(postId:string){
        this.http.delete(`http://localhost:4201/api/posts/${postId}`)
            .subscribe(()=>{
                const updatedPosts = this.posts.filter(post => {
                    if(post.id !== postId){return post};
                });
                this.posts = updatedPosts;
                this.postsUpdated.next([...this.posts]);
            })
    }
}