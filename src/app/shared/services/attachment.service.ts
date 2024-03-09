import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Params } from "../interface/core.interface";
import { Attachment, AttachmentModel } from "../interface/attachment.interface";

@Injectable({
  providedIn: "root",
})
export class AttachmentService {

  constructor(private http: HttpClient) {}

  getAttachments(payload?: Params): Observable<AttachmentModel> {
    return this.http.get<AttachmentModel>(`${environment.CLOUD_URL}/admin/attachments`, { params: payload });
  }

  createAttachments(payload?: File[]): Observable<AttachmentModel> {
    const data: FormData = new FormData();
    for(let file of payload)
       data.append('files', file);
    return this.http.post<AttachmentModel>(`${environment.CLOUD_URL}/admin/upload`, data);
  }

}
