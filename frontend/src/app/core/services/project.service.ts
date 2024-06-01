import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {env} from "../../../environments/environment";
import {BehaviorSubject} from "rxjs";
import {Project} from "../models/project.dto";
import {Router} from "@angular/router";
import {FileService} from "../../modules/workspace/services/file.service";
import {SocketService} from "./socket.service";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = env.API_URL;
  private projectSubject = new BehaviorSubject<Project | null>(null);
  public project$ = this.projectSubject.asObservable();

  constructor(private http: HttpClient, private router: Router,
              private fileService: FileService, private socket: SocketService) {}

  public joinProject(projectId: string) {
    if (this.projectSubject.value !== null) {
      this.leaveProject(this.projectSubject.value?.id)
    }
    return this.http.post<Project>(`${this.apiUrl}project/join/${projectId}`, {},
      {observe: 'response', withCredentials: true})
  }

  public createProject(name: string) {
    if (this.projectSubject.value !== null) {
      this.leaveProject(this.projectSubject.value?.id)
    }
    return this.http.post<Project>(`${this.apiUrl}project`, name,
      {observe: 'response', withCredentials: true})
  }

  public leaveProject(projectId: string) {
    this.socket.disconnectFromSocket()
    this.fileService.clearAllData()
    void this.router.navigate(['/'])
    this.projectSubject.next(null);
    this.http.post(`${this.apiUrl}project/leave/${projectId}`, {}, {observe: 'response', withCredentials: true}).subscribe()
  }

  openProject(files: FileList) {
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.fileService.addFile('file', '', this.fileService.filesSubject.value, "", file.name, true, undefined, e.target.result)
        };
        reader.readAsText(<Blob>file);
      });
    }
  }

  public deleteProject(projectId: string) {
    this.socket.disconnectFromSocket()
    this.fileService.clearAllData()
    void this.router.navigate(['/'])
    this.projectSubject.next(null);
    return this.http.delete(`${this.apiUrl}project/${projectId}`, {observe: 'response', withCredentials: true})
  }

  public getProject(projectId: string) {
    this.http.get<Project>(`${this.apiUrl}project/${projectId}`, {observe: 'response', withCredentials: true})
      .subscribe({
          next: (response) => this.projectSubject.next(response.body),
          error: (e) => console.error(e)
        }
      )
  }
}
