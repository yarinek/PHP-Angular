import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { catchError, tap } from 'rxjs';

@Component({
  selector: 'app-upload-input',
  templateUrl: './upload-input.component.html',
  styleUrls: ['./upload-input.component.scss'],
})
export class UploadInputComponent implements OnInit {
  form = new FormGroup({
    title: new FormControl('', Validators.required),
    photo: new FormControl('', Validators.required),
  });

  constructor(private service: PostService) {}

  ngOnInit(): void {}

  addPost(): void {
    const { title, photo } = this.form.value;
    const formData = new FormData();
    formData.append('photo', photo);
    formData.append('title', title);

    this.service
      .uploadPost(formData)
      .pipe(
        tap((response) => {}),
        catchError((err) => {
          throw err;
        })
      )
      .subscribe();
  }
}
