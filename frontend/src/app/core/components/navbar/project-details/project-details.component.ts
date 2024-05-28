import {Component, OnInit} from '@angular/core';
import {ProjectService} from "../../../services/project.service";
import {ProjectSocketService} from "../../../services/project-socket.service";

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss'
})
export class ProjectDetailsComponent implements OnInit {
  members: string[] = []
  projectName: string = "";
  protected id: string = '';

  constructor(protected projectService: ProjectService, private socket: ProjectSocketService) {}

  ngOnInit(): void {
    this.projectService.project$.subscribe({
        next: project => {
          this.id = project?.id ?? '';
          this.projectName = project?.name ?? '';
          this.members = project?.members ? [project.owner, ...project.members] : [];
        }
      }
    )
    this.socket.memberListUpdate().subscribe({
      next: m => this.members = m
    })
  }

  copyId() {
    navigator.clipboard.writeText(this.id).then()
  }
}
