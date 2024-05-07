import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, tap} from "rxjs";
import {env} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {User} from "../../../core/models/user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = env.API_URL;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
  }

  signup(userBody: User): Observable<any> {
    return this.http.post(`${this.apiUrl}auth/signup`, userBody, {observe: 'response', withCredentials: true});
  }

  signin(loginBody: User): Observable<any> {
    return this.http.post(`${this.apiUrl}auth/signin`, loginBody, {observe: 'response', withCredentials: true});
  }

  signout(): Observable<any> {
    return this.http.post(`${this.apiUrl}auth/signout`,{},{observe: 'response', withCredentials: true});
  }

  checkAuthStatus() {
    return this.http.get(`${this.apiUrl}auth/session`, {observe: 'response', withCredentials: true}).pipe(
      tap({
          next: () => this.isAuthenticatedSubject.next(true),
          error: () => this.isAuthenticatedSubject.next(false)
        }
      )
    );
  }

  setAuthStatus(isAuthenticated: boolean) {
    this.isAuthenticatedSubject.next(isAuthenticated);
  }
}

