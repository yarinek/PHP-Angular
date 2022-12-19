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
    return this.http.get<IPost[]>('api/preview');
  }

  getAllAuthPosts(): Observable<IPost[]> {
    return this.http.get<IPost[]>('api/posts');
  }

  uploadPost(body: any): Observable<any> {
    return this.http.post('api/posts', body);
  }

  addLike(id: number): Observable<any> {
    return this.http.put(`api/posts/${id}/like`, {});
  }

  unlike(id: number): Observable<any> {
    return this.http.put(`api/posts/${id}/unlike`, {});
  }
}
