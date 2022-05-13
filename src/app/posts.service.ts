import {
  HttpClient,
  HttpEventType,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { Post } from "./post.model";

@Injectable({
  providedIn: "root",
})
export class PostsService {
  error = new Subject<string>();
  firebaseUrl =
    "https://angular-course-70bd6-default-rtdb.asia-southeast1.firebasedatabase.app/";

  constructor(private http: HttpClient) {}

  createAndStorePost(title: string, content: string) {
    const postData: Post = { title: title, content: content };
    this.http
      .post<{ name: string }>(this.firebaseUrl + "posts.json", postData, {
        observe: "response",
      })
      // .subscribe(
      //   (responseData) => {
      //     console.log(responseData);
      //   },
      //   (error) => {
      //     this.error.next(error.message);
      //   }
      // );
      .subscribe({
        next: (responseData) => {
          console.log(responseData.body);
        },
        error: (e) => {
          this.error.next(e.message);
        },
      });
  }

  fetchPosts() {
    let searchParams = new HttpParams();
    searchParams = searchParams.append("print", "pretty");
    searchParams = searchParams.append("custom", "key");
    return this.http
      .get<{ [key: string]: Post }>(this.firebaseUrl + "posts.json", {
        headers: new HttpHeaders({ CustomHeader: "hello" }),
        params: searchParams,
      })
      .pipe(
        map((responseData) => {
          const postsArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key });
            }
          }
          return postsArray;
        }),
        catchError((errorRes) => {
          return throwError(() => errorRes);
        })
      );
  }

  deletePosts() {
    return this.http
      .delete(this.firebaseUrl + "posts.json", { observe: "events" })
      .pipe(
        tap((event) => {
          console.log(event);
          if (event.type === HttpEventType.Sent) {
            //...
          }
          if (event.type === HttpEventType.Response) {
            console.log(event.body);
          }
        })
      );
  }
}
