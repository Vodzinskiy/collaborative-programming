import { Injectable } from '@angular/core';
import {env} from "../../../environments/environment";
import {BehaviorSubject} from "rxjs";
import {User} from "../models/user.dto";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = env.API_URL;
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  public getUser() {
    this.http.get<User>(`${this.apiUrl}user`,  {observe: 'response', withCredentials: true}).subscribe({
      next: (response) => this.userSubject.next(response.body),
      error: (e) => console.error(e)
    })
  }

  setUser(user: User) {
    this.userSubject.next(user);
  }
}
