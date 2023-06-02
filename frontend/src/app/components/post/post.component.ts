import { Component, EventEmitter, Input, Output } from '@angular/core';
import { tap } from 'rxjs';
import { IPost } from './post.model';
import { PostService } from './post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent {
  @Input() postDetails: IPost = {} as IPost;
  commentValue!: string;
  @Output() deletePosts = new EventEmitter();
  showHeart: boolean = false;

  constructor(private service: PostService) {}

  handleLike(position = 'post'): void {
    const { id } = this.postDetails;
    const request = this.postDetails.isLiked
      ? this.service.unlike(id)
      : this.service.addLike(id);
    request
      .pipe(
        tap((likesNumber) => {
          this.postDetails.likes = likesNumber;
          this.postDetails.isLiked = !this.postDetails.isLiked;
        }),
      )
      .subscribe();
    if(position === 'picture'){
      this.showHeart = true;
      setTimeout(() => this.showHeart = false, 1000)
    }
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

  deletePost(id: number): void {
    this.service
      .deletePost(id).pipe(
        tap(() => this.deletePosts.emit(id))
      )
      .subscribe();
  }
}
