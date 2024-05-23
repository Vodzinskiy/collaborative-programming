import {Component, OnInit} from '@angular/core';
import {ProjectService} from "../../../services/project.service";
import {DialogComponent} from "../../../../shared/components/dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {DialogData} from "../../../models/dialog-data.dto";
import {Role} from "../../../models/project.dto";
import {Router} from "@angular/router";
import {SocketService} from "../../../services/socket.service";

@Component({
  selector: 'app-project-menu',
  templateUrl: './project-menu.component.html',
  styleUrl: './project-menu.component.scss'
})
export class ProjectMenuComponent implements OnInit {
  protected owner: boolean = false;
  private id: string = '';

  constructor(private projectService: ProjectService, public dialog: MatDialog, private router: Router, private socket: SocketService) {
  }

  ngOnInit(): void {
    this.projectService.project$.subscribe({
        next: project => {
          if (project !== null) {
            this.owner = project.role === Role.OWNER
            this.id = project.id
            this.socket.connectToSocket(project.id)
          } else {
            this.id = ''
          }
        }
      }
    )
  }

  createProject() {
    const data: DialogData = {buttonTitle: "Створити", placeholder: "Назва", title: "Новий Проект"}
    const dialogRef = this.dialog.open(DialogComponent, {data});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectService.createProject(result).subscribe({
          next: (project) => {
            this.socket.connectToSocket(project.body?.id)
            void this.router.navigate(['/p', project.body?.id])
          }
        })
      }
    });
  }

  joinProject() {
    const data: DialogData = {buttonTitle: "Доєднатись", placeholder: "ID", title: "Доєднатися до проекту"}
    const dialogRef = this.dialog.open(DialogComponent, {data});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectService.joinProject(result).subscribe({
          next: (project) => {
            this.socket.connectToSocket(project.body?.id)
            void this.router.navigate(['/p', project.body?.id])
          }
        })
      }
    });
  }

  leaveProject() {
    this.projectService.leaveProject(this.id).subscribe({
      next: () => {
        this.socket.disconnectFromSocket()
        void this.router.navigate(['/'])
      }
    })
  }

  deleteProject() {
    if (this.owner) {
      this.projectService.deleteProject(this.id).subscribe({
          next: () => {
            void this.router.navigate(['/'])
            this.owner = false
          }
        }
      )
    }
  }
}
