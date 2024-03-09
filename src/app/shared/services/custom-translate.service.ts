import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError } from "rxjs";
import { environment } from "../../../environments/environment";
import { Params } from "../interface/core.interface";
import { Currency, CurrencyModel } from "../interface/currency.interface";
import { TranslateLoader } from "@ngx-translate/core";

@Injectable({
  providedIn: "root",
})
export class CustomTranslateLoader implements TranslateLoader{

  constructor(private http: HttpClient) {}

  getTranslation(lang: string): Observable<any> { 
   return this.http.get(`${environment.CDN}/assetss/i18n/${lang}.json`)
          .pipe(
            catchError(_ => this.http.get(`${environment.CDN}/assetss/i18n/en.json`))
          );
  }

}
