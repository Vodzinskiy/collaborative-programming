import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss'
})
export class ProjectDetailsComponent implements OnInit {
  testName = ["test1", "test2", "test3"]
  projectName: string = "projectName";

  ngOnInit(): void {
  }
}
