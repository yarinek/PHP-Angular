import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { catchError, tap } from 'rxjs';
import { RegisterService } from './register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  form = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  constructor(private service: RegisterService, public dialogRef: MatDialogRef<RegisterComponent>) {}

  ngOnInit(): void {}

  registerUser(): void {
    this.service
      .register(this.form.value)
      .pipe(
        tap(() => this.close()),
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
