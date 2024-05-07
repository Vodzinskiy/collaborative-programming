import {Component, HostListener} from '@angular/core';

@Component({
  selector: 'app-workspace-main',
  templateUrl: './workspace-main.component.html',
  styleUrl: './workspace-main.component.scss'
})
export class WorkspaceMainComponent {
  leftWidth = 20;
  leftVisible = true;
  isResizing = false;

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isResizing) {
      this.leftWidth = this.leftWidth = Math.max(5, Math.min(95, (event.clientX / window.innerWidth) * 100));
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
  }
}
