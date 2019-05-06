import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { Post } from '../../../models/post.model';
import { PostService } from '../../services/post.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy{
  isAuth:boolean = false;
  posts:Post[]=[];
  spinner:boolean = false;
  totalPosts:number = 0;
  postsPerPage:number = 2;
  currentPage:number = 1;
  pageSizeOptions:number[] = [2,5,10];
  userId:string;
  private postsSub:Subscription;
  private authSub:Subscription;

  constructor(public postService:PostService, private authService:AuthService){}
  
  ngOnInit(){
    this.spinner = true;
    this.postService.getPosts(this.postsPerPage,this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postService.getPostUpdateListener()
      .subscribe((postData:{posts:Post[],postCount:number})=>{
        this.spinner = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
    this.isAuth = this.authService.getIsAuth();
    this.authService.getAuthStatus()
      .subscribe(isAuth => {
        this.isAuth = isAuth;
        this.userId = this.authService.getUserId();
      });
  };

  onDelete(postId:string){
    this.postService.deletePost(postId).subscribe(()=>{
      this.postService.getPosts(this.postsPerPage,this.currentPage);
    });
  }

  changePage(pageData:PageEvent){
    this.spinner = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage,this.currentPage);
  }

  ngOnDestroy(){
    this.postsSub.unsubscribe();
  }
}