import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, tap} from "rxjs";
import {env} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {User} from "../../../core/models/user.dto";
import {ProjectService} from "../../../core/services/project.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = env.API_URL;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient, private projectService: ProjectService) {}

  signup(userBody: User): Observable<any> {
    return this.http.post(`${this.apiUrl}auth/signup`, userBody, {observe: 'response', withCredentials: true});
  }

  signin(loginBody: User) {
    return this.http.post<User>(`${this.apiUrl}auth/signin`, loginBody, {observe: 'response', withCredentials: true})
  }

  signout(): Observable<any> {
    let id = this.projectService.projectSubject.value?.id
    if (id) {
      this.projectService.leaveProject(id)
    }
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

