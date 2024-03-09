import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Params } from "../interface/core.interface";
import { Tag, TagModel } from "../interface/tag.interface";

@Injectable({
  providedIn: "root",
})
export class TagService {

  constructor(private http: HttpClient) {}

  getTags(payload?: Params): Observable<TagModel> {
    return this.http.get<TagModel>(`${environment.CLOUD_URL}/admin/tags`, { params: payload });
  }

  createTag(payload?: Tag): Observable<TagModel> {
    return this.http.post<TagModel>(`${environment.CLOUD_URL}/admin/tag`, payload);
  }

}
