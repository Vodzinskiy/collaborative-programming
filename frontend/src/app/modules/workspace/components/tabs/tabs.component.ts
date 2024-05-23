import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {ResizeService} from "../../services/resize.service";
import {MatTabGroup} from "@angular/material/tabs";
import {FileService} from "../../services/file.service";
import {FileModel} from "../../../../core/models/file.model";

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss'
})
export class TabsComponent implements OnInit {
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  tabs: FileModel[] = []
  width: number = 0;

  constructor(protected resizeService: ResizeService, protected fileService: FileService) {}

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.resize()
  }

  closeTab(index: number) {
    this.fileService.closeFile(index)
  }

  resize()  {
    this.resizeService.currentLeftWidth.subscribe(value => {
      this.width = window.innerWidth - value;
      if (this.tabGroup) {
        this.tabGroup.updatePagination()
      }
    });
  }

  ngOnInit(): void {
    this.resize()
    this.fileService.openFilesObservable$.subscribe({
      next: t => this.tabs = t
    });
    this.fileService.tabIndexObservable$.subscribe(tabIndex => {
      if (tabIndex !== null) {
        this.tabGroup.selectedIndex = tabIndex;
      }
    });
  }
 }
