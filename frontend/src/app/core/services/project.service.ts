import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {env} from "../../../environments/environment";
import {BehaviorSubject} from "rxjs";
import {Project} from "../models/project.dto";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = env.API_URL;
  private projectSubject = new BehaviorSubject<Project | null>(null);
  public project$ = this.projectSubject.asObservable();

  constructor(private http: HttpClient) {}

  public createProject(name: string) {
    return this.http.post<Project>(`${this.apiUrl}project`, name, {observe: 'response', withCredentials: true})
  }

  public joinProject(id: string) {
    return this.http.post<Project>(`${this.apiUrl}project/join/${id}`, {}, {observe: 'response', withCredentials: true})
  }

  public leaveProject(id: string) {
    this.projectSubject.next(null);
    return this.http.post(`${this.apiUrl}project/leave/${id}`, {}, {observe: 'response', withCredentials: true})
  }

  public deleteProject(id: string) {
    this.projectSubject.next(null);
    return this.http.delete(`${this.apiUrl}project/${id}`, {observe: 'response', withCredentials: true})
  }

  public getProject(id: string) {
    this.http.get<Project>(`${this.apiUrl}project/${id}`, {observe: 'response', withCredentials: true})
      .subscribe({
        next: (response: HttpResponse<Project>) => {
          this.projectSubject.next(response.body);
        },
      error: (e) => console.error('Error loading data:', e)
      }
    )
  }
}
