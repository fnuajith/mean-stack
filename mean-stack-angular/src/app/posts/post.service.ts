import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiURL + '/posts/';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number): void {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ posts: any, maxPosts: number }>(BACKEND_URL + queryParams)
      .pipe(map((postData) => {
        return {
          posts: postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
              creator: post.creator
            };
          }),
          maxPosts: postData.maxPosts};
      }))
      .subscribe((transformedPostData) => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({ posts: [...this.posts], postCount: transformedPostData.maxPosts });
      });
  }

  getPostsUpdatedListener(): Observable<{posts: Post[], postCount: number}> {
    return this.postsUpdated.asObservable();
  }

  getPost(postId: string): Observable<{_id: string, title: string, content: string, imagePath: string, creator: string}> {
    return this.http.get<{_id: string, title: string, content: string, imagePath: string, creator: string}>(BACKEND_URL + postId);
  }

  // Sending data without an image/file does not require FormData, data can simply be passed as a json file
  /*addPost(postTitle: string, postContent: string): void {
    const post: Post = {
      id: null,
      title: postTitle,
      content: postContent,
    };
    this.http.post<{post: any}>(BACKEND_URL, post)
    .subscribe((postData) => {
      console.log(postData);
      post.id = postData.post._id;
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(['/']);
    });
  }*/

  addPost(postTitle: string, postContent: string, image: File): void {
    const postData = new FormData();
    postData.append('id', null);
    postData.append('title', postTitle);
    postData.append('content', postContent);
    postData.append('image', image, postTitle);

    this.http
      .post<{post: any}>(
        BACKEND_URL,
        postData)
      .subscribe((response) => {
        this.router.navigate(['/']);
    });
  }

  editPost(postId: string, postTitle: string, postContent: string, image: File | string): void {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', postId);
      postData.append('title', postTitle);
      postData.append('content', postContent);
      postData.append('image', image, postTitle);
    } else {
      postData = {
        id: postId,
        title: postTitle,
        content: postContent,
        imagePath: image,
        creator: null
      };
    }
    this.http.put<{post: any}>(
      BACKEND_URL,
      postData)
      .subscribe((response) => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + postId);
  }
}
