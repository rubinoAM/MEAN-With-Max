import { Component, Input } from '@angular/core';
import { Post } from '../../../models/post.model';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent{
  @Input() posts:Post[]=[];

  constructor(private postService:PostService){}
}