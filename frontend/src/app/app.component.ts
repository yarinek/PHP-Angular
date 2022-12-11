import { Component, OnInit } from '@angular/core';
import { PostService } from './components/post/post.service';
import { tap } from 'rxjs';
import { IPost } from './components/post/post.model';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  posts?: IPost[];

  constructor(private postService: PostService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.postService
      .getAllPosts()
      .pipe(
        tap((data) => {
          this.posts = data;
        })
      )
      .subscribe();
  }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent);

    dialogRef.afterClosed().pipe(
      tap(() => {
        console.log('dialog closed');
      })
    );
  }

  openRegisterDialog(): void {
    const dialogRef = this.dialog.open(RegisterComponent);

    dialogRef.afterClosed().pipe(
      tap(() => {
        console.log('dialog closed');
      })
    );
  }
}
