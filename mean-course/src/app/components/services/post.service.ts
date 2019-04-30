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
                        imagePath:post.imagePath,
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
        return this.http.get<{_id:string, title:string, content:string, imagePath:string}>('http://localhost:4201/api/posts/' + id);
    }

    addPost(post:Post,image:File){
        console.log(image, post);
        const postData = new FormData();
        postData.append("title",post.title);
        postData.append("content",post.content);
        postData.append('image',image,post.title);
        this.http.post<{message:string,post:Post}>('http://localhost:4201/api/posts',postData)
            .subscribe((resData)=>{
                const newPost:Post = {
                    id: resData.post.id,
                    title:post.title,
                    content:post.content,
                    imagePath:resData.post.imagePath,
                }
                console.log(newPost);
                this.posts.push(newPost);
                this.postsUpdated.next([...this.posts]);
                this.router.navigate(['/']);
            });
    }

    updatePost(id:string,title:string,content:string,image:string|File){
        let postData:Post|FormData;
        if(typeof(image)==='object'){
            postData = new FormData();
            postData.append("id",id);
            postData.append("title",title);
            postData.append("content",content);
            postData.append('image',image,title);
        } else {
            postData = {
                id:id,
                title:title,
                content:content,
                imagePath:image,
            }
        }
        this.http.put("http://localhost:4201/api/posts/" + id,postData)
            .subscribe((resp)=>{
                const updatedPosts = [...this.posts];
                const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
                const post:Post = {
                    id:id,
                    title:title,
                    content:content,
                    imagePath:"",
                }
                updatedPosts[oldPostIndex] = post;
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