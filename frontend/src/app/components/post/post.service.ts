import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPost } from './post.model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private http: HttpClient) {}

  getAllPosts(): Observable<IPost[]> {
    return this.http.get<IPost[]>('api/posts');
  }

  uploadPost(body: any): Observable<any> {
    return this.http.post('api/posts', body);
  }
}
