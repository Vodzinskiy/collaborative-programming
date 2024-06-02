import { Injectable } from '@angular/core';
import {env} from "../../../environments/environment";
import {User} from "../models/user.dto";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = env.API_URL;

  constructor(private http: HttpClient) {}

  public getUser() {
    return this.http.get<User>(`${this.apiUrl}user`, { observe: 'response', withCredentials: true })
  }

  public updateUser(user: User) {
    return this.http.patch<User>(`${this.apiUrl}user`, user,{ observe: 'response', withCredentials: true })
  }

  public deleteUser() {
    return this.http.delete(`${this.apiUrl}user`, { observe: 'response', withCredentials: true })
  }
}
