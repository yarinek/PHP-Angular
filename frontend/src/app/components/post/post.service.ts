import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPostResponse } from './post.model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  url = 'api/posts';
  constructor(private http: HttpClient) {}

  getAllPosts(params: any): Observable<IPostResponse> {
    return this.http.get<IPostResponse>('api/preview', { params });
  }

  getAllAuthPosts(params: any): Observable<IPostResponse> {
    return this.http.get<IPostResponse>(this.url, {params});
  }

  uploadPost(body: any): Observable<any> {
    return this.http.post(this.url, body);
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`)
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
