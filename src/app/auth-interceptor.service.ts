import {
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Observable, tap } from "rxjs";

export class AuthInterceptorService implements HttpInterceptor {
  constructor() {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log("Request is on its way");
    console.log(req.url);
    const modifiedReq = req.clone({
      headers: req.headers.append("Auth", "xyz"),
    });
    return next.handle(modifiedReq).pipe(
      tap((event) => {
        if (event.type === HttpEventType.Response) {
          console.log("Response arrived, body data: ");
          console.log(event.body);
        }
      })
    );
  }
}
