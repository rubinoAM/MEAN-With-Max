import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { Post } from '../../../models/post.model';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy{
  posts:Post[]=[];
  spinner:boolean = false;
  totalPosts = 10;
  postsPerPage = 2;
  pageSizeOptions = [2,5,10];
  private postsSub:Subscription;

  constructor(public postService:PostService){}
  
  ngOnInit(){
    this.spinner = true;
    this.postService.getPosts();
    this.postsSub = this.postService.getPostUpdateListener().subscribe((posts:Post[])=>{
      this.spinner = false;
      this.posts = posts;
    });
  };

  onDelete(postId:string){
    this.postService.deletePost(postId);
  }

  changePage(pageData:PageEvent){
    console.log(pageData);
  }

  ngOnDestroy(){
    this.postsSub.unsubscribe();
  }
}