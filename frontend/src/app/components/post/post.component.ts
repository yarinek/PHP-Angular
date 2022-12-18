import { Component, Input, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import { IPost } from './post.model';
import { PostService } from './post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  @Input() postDetails: IPost = {} as IPost;

  constructor(private service: PostService) {}

  ngOnInit(): void {}

  addLike(): void {
    const { id } = this.postDetails;
    this.service.addLike(id).pipe(
      tap((likesNumber)=> {
        this.postDetails.likes = likesNumber;
      })
    ).subscribe();
  }
}
