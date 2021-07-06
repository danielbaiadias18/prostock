import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpRequest, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  URL: string;
  URLLoaded: boolean = false;
  constructor(private http: HttpClient, private config: ConfigService) {

  }

  async getUrl() {
    if (this.URLLoaded) return this.URL;

    return new Promise<string>((ok, err) => {
      this.config.Ready((config) => {
        this.URLLoaded = true;
        ok(this.URL = config.api_url);
      })
    })
  }

  async api(method: HttpMethod | HttpMethodBody, action: string): Promise<any>;
  async api(method: HttpMethod | HttpMethodBody, action: string, body: any): Promise<any>;
  async api(method: HttpMethod | HttpMethodBody, action: string, body?: any): Promise<any> {
    let ret: Observable<any>;
    switch (method) {
      case HttpMethod.GET:
        ret = this.http.get(`${await this.getUrl()}${action}`);
        break;
      case HttpMethod.POST:
      case HttpMethodBody.POST:
        ret = this.http.post(`${await this.getUrl()}${action}`, body);
        break;
      case HttpMethod.PUT:
      case HttpMethodBody.PUT:
        ret = this.http.put(`${await this.getUrl()}${action}`, body);
        break;
      case HttpMethod.DELETE:
        ret = this.http.delete(`${await this.getUrl()}${action}`, body);
        break;
    }

    return new Promise<any>((ok, e) => {
      ret.subscribe(resp => ok(resp),
        (err: HttpErrorResponse) => {
          if (err.status == 400) {
            let model: iModel = new Model(err.error);
            e(model);
          } else
            e("Não foi possível completar a operação por favor tente novamente mais tarde");
        })
    })
  }

  async File(method: HttpMethodBody, action: string, file: File) {
    let ret: HttpRequest<any>;

    switch (method) {
      case HttpMethodBody.POST:
        ret = new HttpRequest('POST', `${await this.getUrl()}${action}`, file, {
          reportProgress: true,
          headers: new HttpHeaders({
            "Content-Type": file.type
          })
        });
        break;
      case HttpMethodBody.PUT:
        ret = new HttpRequest('PUT', `${await this.getUrl()}${action}`, file, {
          reportProgress: true,
          headers: new HttpHeaders({
            "Content-Type": file.type
          })
        });
        break;
    }

    let obj;
    return new Promise<any>((ok, e) => {
      this.http.request(ret).subscribe(resp => { obj = resp },
        (err: HttpErrorResponse) => {
          if (err.status == 400) {
            let model: iModel = new Model(err.error);
            e(model);
          } else
            e("Não foi possível completar a operação por favor tente novamente mais tarde");
        },
        () => ok(obj))
    });
  }
}

export enum HttpMethodBody {
  POST = 1,
  PUT = 2
}

export enum HttpMethod {
  GET = 0,
  POST = 1,
  PUT = 2,
  DELETE = 3
}

export class iModel {
  Message: string;
  ModelState: Map<string, string[]>;
}

class Model extends iModel {
  constructor(Model) {
    super();
    this.Message = Model.Message;
    this.ModelState = new Map();
    for (let prop in Model.ModelState)
      this.ModelState.set(prop, Model.ModelState[prop]);
  }
}