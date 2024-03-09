import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Params } from "../interface/core.interface";
import { Answer, AnswerModel, Blog, BlogModel } from "../interface/blog.interface";

@Injectable({
  providedIn: "root",
})
export class BlogService {

  header:HttpHeaders = new HttpHeaders();
  
  constructor(private http: HttpClient) {
    //this.header.append('Content-Type', 'application/json');
  }

  getBlogs(payload?: Params): Observable<BlogModel> {
    return this.http.get<BlogModel>(`${environment.CLOUD_URL}/admin/blogs`, { params: payload });
  }

  createBlog(payload?: Blog): Observable<Blog> {
    return this.http.post<Blog>(`${environment.CLOUD_URL}/admin/blog`, payload);
  }

  getAnswers(id: number): Observable<AnswerModel>{
    return this.http.get<AnswerModel>(`${environment.CLOUD_URL}/admin/blog/`+id+'/answers');
  }

  createAnswers(payload: Answer): Observable<Answer>{
    let options = { headers: this.header };
    return this.http.post<Answer>(`${environment.CLOUD_URL}/admin/blog/answers/`+payload.blog.id ,payload, options);
  }

  updateBlogStatus(id: number, status: boolean) : Observable<boolean> {
    const httpParams = new HttpParams()
  .append('id', id)
  .append('status', status);
    return this.http.post<boolean>(`${environment.CLOUD_URL}/admin/blog/status`, httpParams, {params: httpParams });
  }

  deleteBlog(id: number) : Observable<boolean> {
    const httpParams = new HttpParams()
    .append('id', id)
    return this.http.post<boolean>(`${environment.CLOUD_URL}/admin/blog/delete`, httpParams, {params: httpParams });
  }

  deleteAnswer(id: number): Observable<AnswerModel>{
    let options = { headers: this.header };
    return this.http.delete<AnswerModel>(`${environment.CLOUD_URL}/admin/blog/answer/delete`+id);
  }

}
