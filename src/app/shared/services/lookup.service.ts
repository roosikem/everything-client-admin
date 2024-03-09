import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Lookup, LookupModel } from "../interface/lookup.interface";

@Injectable({
  providedIn: "root",
})
export class LookupService {

  constructor(private http: HttpClient) {}


  lookups(): Observable<LookupModel>{
    return this.http.get<LookupModel>(`${environment.CLOUD_URL}/admin/lookup`);
  }

}
