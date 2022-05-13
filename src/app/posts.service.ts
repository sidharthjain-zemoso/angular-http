import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
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
      .post<{ name: string }>(this.firebaseUrl + "posts.json", postData)
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
          console.log(responseData);
        },
        error: (e) => {
          this.error.next(e.message);
        },
      });
  }

  fetchPosts() {
    return this.http
      .get<{ [key: string]: Post }>(this.firebaseUrl + "posts.json")
      .pipe(
        map((responseData) => {
          const postsArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key });
            }
          }
          return postsArray;
        })
      );
  }

  deletePosts() {
    return this.http.delete(this.firebaseUrl + "posts.json");
  }
}
