import {Component, HostListener, OnInit} from '@angular/core';
import {ResizeService} from "../../services/resize.service";



@Component({
  selector: 'app-workspace-main',
  templateUrl: './workspace-main.component.html',
  styleUrl: './workspace-main.component.scss'
})
export class WorkspaceMainComponent implements OnInit {
  leftWidth = 384;
  leftVisible = true;
  isResizing = false;
  minWidth = 0;
  maxWidth = 0;

  constructor(private resizeService: ResizeService) {
  }

  ngOnInit(): void {
    this.minWidth = window.innerWidth * 0.05;
    this.maxWidth = window.innerWidth * 0.95;
    this.leftWidth = Math.ceil(window.innerWidth * 0.2);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isResizing) {
      const newValue = Math.max(this.minWidth, Math.min(this.maxWidth, event.clientX));
      this.resizeService.updateLeftWidth(newValue);
      this.leftWidth = newValue;
    }
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.isResizing = false;
  }

  startResizing() {
    this.isResizing = true;
  }

  toggleLeft(): void {
    this.leftVisible = !this.leftVisible;
    if (this.leftVisible) {
      this.resizeService.updateLeftWidth(this.leftWidth);
    } else {
      this.resizeService.updateLeftWidth(0);
    }
  }
}
