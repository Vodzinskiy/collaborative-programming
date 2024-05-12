import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, tap} from "rxjs";
import {env} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {User} from "../../../core/models/user.dto";
import {Router} from "@angular/router";
import {UserService} from "../../../core/services/user.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = env.API_URL;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient, private router: Router, private userService: UserService) {}

  signup(userBody: User): Observable<any> {
    return this.http.post(`${this.apiUrl}auth/signup`, userBody, {observe: 'response', withCredentials: true});
  }

  signin(loginBody: User) {
    this.http.post<User>(`${this.apiUrl}auth/signin`, loginBody, {observe: 'response', withCredentials: true}).subscribe(
      (response) => {
        response.body && this.userService.setUser(response.body);
        void this.router.navigate(['/'])
      }
    );
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

