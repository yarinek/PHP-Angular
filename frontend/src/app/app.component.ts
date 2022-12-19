import { Component, OnInit } from '@angular/core';
import { PostService } from './components/post/post.service';
import { tap } from 'rxjs';
import { IPost } from './components/post/post.model';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { TranslateService } from '@ngx-translate/core';
import { MatSelectChange } from '@angular/material/select';
import { AuthService } from './components/auth/auth.service';
import { UploadInputComponent } from './components/post/upload-input/upload-input.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  posts?: IPost[];

  constructor(
    private postService: PostService,
    public dialog: MatDialog,
    private translate: TranslateService,
    private authService: AuthService
  ) {
    translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    this.getAllPosts();
  }

  getAllPosts(): void {
    const request = this.isAuth()
      ? this.postService.getAllAuthPosts()
      : this.postService.getAllPosts();
    request
      .pipe(
        tap((data) => {
          this.posts = data;
        })
      )
      .subscribe();
  }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent);

    dialogRef
      .afterClosed()
      .pipe(tap(() => this.getAllPosts()))
      .subscribe();
  }

  openPostDialog(): void {
    const dialogRef = this.dialog.open(UploadInputComponent, {
      width: '70vw',
    });

    dialogRef
      .afterClosed()
      .pipe(tap(() => this.getAllPosts()))
      .subscribe();
  }

  openRegisterDialog(): void {
    const dialogRef = this.dialog.open(RegisterComponent);

    dialogRef
      .afterClosed()
      .pipe(tap(() => this.getAllPosts()))
      .subscribe();
  }

  changeLang(event: MatSelectChange): void {
    this.translate.use(event.value);
  }

  isAuth(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  logout(): void {
    this.authService
      .logout()
      .pipe(
        tap(() => {
          localStorage.removeItem('token');
          this.getAllPosts();
        })
      )
      .subscribe();
  }
}
