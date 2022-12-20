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
  commentValue!: string;

  constructor(private service: PostService) {}

  ngOnInit(): void {}

  handleLike(): void {
    const { id } = this.postDetails;
    const request = this.postDetails.isLiked
      ? this.service.unlike(id)
      : this.service.addLike(id);
    request
      .pipe(
        tap((likesNumber) => {
          this.postDetails.likes = likesNumber;
          this.postDetails.isLiked = !this.postDetails.isLiked;
        })
      )
      .subscribe();
  }

  addComment(): void {
    const { id } = this.postDetails;
    this.service
      .addComment(id, this.commentValue)
      .pipe(
        tap((data) => {
          this.postDetails.comments = data.comments;
          this.commentValue = '';
        })
      )
      .subscribe();
  }

  deleteComment(id: number): void {
    this.service
      .deleteComment(id)
      .pipe(
        tap((data) => {
          this.postDetails.comments = data.comments;
        })
      )
      .subscribe();
  }
}
