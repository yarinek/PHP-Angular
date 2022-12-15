import { Component, OnInit } from '@angular/core';
import { PostService } from './components/post/post.service';
import { tap } from 'rxjs';
import { IPost } from './components/post/post.model';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { TranslateService } from '@ngx-translate/core';
import { MatSelectChange } from '@angular/material/select';

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
    private translate: TranslateService
  ) {
    translate.setDefaultLang('en');
  }

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

    dialogRef
      .afterClosed()
      .pipe(
        tap((data) => {
          console.log(data);
          console.log('dialog closed');
        })
      )
      .subscribe();
  }

  openRegisterDialog(): void {
    const dialogRef = this.dialog.open(RegisterComponent);

    dialogRef
      .afterClosed()
      .pipe(
        tap(() => {
          console.log('dialog closed');
        })
      )
      .subscribe();
  }

  changeLang(event: MatSelectChange): void {
    this.translate.use(event.value);
  }
}
