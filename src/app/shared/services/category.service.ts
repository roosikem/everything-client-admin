import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Params } from "../interface/core.interface";
import { Category, CategoryModel } from "../interface/category.interface";

@Injectable({
  providedIn: "root",
})
export class CategoryService {

  header:HttpHeaders = new HttpHeaders();
  constructor(private http: HttpClient) {}

  getCategories(payload?: Params): Observable<CategoryModel> {
    return this.http.get<CategoryModel>(`${environment.CLOUD_URL}/admin/categories`, { params: payload });
  }

  createCategory(payload?: Category): Observable<CategoryModel> {
    let options = { headers: this.header };
    return this.http.post<CategoryModel>(`${environment.CLOUD_URL}/admin/category`,payload, options);
  }

}
