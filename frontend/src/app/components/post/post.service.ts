import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPost } from './post.model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  url = 'api/posts';
  constructor(private http: HttpClient) {}

  getAllPosts(): Observable<IPost[]> {
    return this.http.get<IPost[]>('api/preview');
  }

  getAllAuthPosts(): Observable<IPost[]> {
    return this.http.get<IPost[]>(this.url);
  }

  uploadPost(body: any): Observable<any> {
    return this.http.post(this.url, body);
  }

  addLike(id: number): Observable<any> {
    return this.http.put(`${this.url}/${id}/like`, {});
  }

  unlike(id: number): Observable<any> {
    return this.http.put(`${this.url}/${id}/unlike`, {});
  }

  addComment(id: number, comment: string): Observable<any> {
    return this.http.post(`${this.url}/${id}/comment`, { comment });
  }

  deleteComment(id: number): Observable<any> {
    return this.http.delete(`api/comments/${id}`);
  }
}
