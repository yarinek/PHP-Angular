import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { catchError, tap } from 'rxjs';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private service: LoginService,
    public dialogRef: MatDialogRef<LoginComponent>
  ) {}

  ngOnInit(): void {}

  login(): void {
    this.service
      .login(this.form.value)
      .pipe(
        tap((data) => {
          localStorage.setItem('token', data.token);
          this.dialogRef.close(data);
        }),
        catchError((err) => {
          throw err;
        })
      )
      .subscribe();
  }

  close(): void {
    this.dialogRef.close();
  }
}
