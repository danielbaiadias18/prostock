import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/User';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor() {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')!));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  // login(username: any, password: any) {
  //   return this.http.post<any>(`http://192.168.0.3/avaliacaoOnline/api/login`, { username, password })
  //     .pipe(map(user => {
  //       // store user details and jwt token in local storage to keep user logged in between page refreshes
  //       localStorage.setItem('currentUser', JSON.stringify(user));
  //       this.currentUserSubject.next(user);
  //       return user;
  //     }));
  // }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null!);
  }
}
