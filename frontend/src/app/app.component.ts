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
  posts: IPost[] = [];
  pagination = {size: 5, page: 1};
  lastPage!: number;

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

  getAllPosts(customPage?: number): void {
    const {page, size} = this.pagination
    const cstPage = customPage ?? page;
    const request = this.isAuth()
      ? this.postService.getAllAuthPosts({page: cstPage, size})
      : this.postService.getAllPosts({page: cstPage, size});
    request
      .pipe(
        tap(({data, last_page}) => {
          this.posts.push(...data);
          this.posts = this.posts.filter((obj, index, self) => self.findIndex(t => t.id === obj.id) === index);
          this.lastPage = last_page;
        })
      )
      .subscribe();
  }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent);

    dialogRef
      .afterClosed()
      .pipe(tap(() => this.getAllPosts(1)))
      .subscribe();
  }

  openPostDialog(): void {
    const dialogRef = this.dialog.open(UploadInputComponent, {
      width: '70vw',
    });

    dialogRef
      .afterClosed()
      .pipe(tap(() => this.getAllPosts(1)))
      .subscribe();
  }

  openRegisterDialog(): void {
    const dialogRef = this.dialog.open(RegisterComponent);

    dialogRef
      .afterClosed()
      .pipe(tap(() => this.getAllPosts(1)))
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

  handleDeletePosts(id:number): void {
    const index = this.posts.findIndex(item => item.id === id);
    this.posts = this.posts.filter(item => item.id !== id);
    this.getAllPosts(Math.ceil(index/this.pagination.size))
  }

  getNextPage(): void {
    this.pagination.page += 1;
    this.getAllPosts()
  }
}
