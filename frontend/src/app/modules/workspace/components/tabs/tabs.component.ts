import {AfterViewInit, Component, HostListener, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ResizeService} from "../../services/resize.service";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {FileService} from "../../services/file.service";
import {DocumentContentComponent} from "../document-content/document-content.component";


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss'
})
export class TabsComponent implements OnInit, AfterViewInit {
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  @ViewChildren(MatTab) tabs!: QueryList<MatTab>;
  @ViewChildren(DocumentContentComponent) contentTabs!: QueryList<DocumentContentComponent>;
  width: number = 0;

  constructor(protected resizeService: ResizeService, protected fileService: FileService) {}

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.resize()
  }

  ngAfterViewInit() {
    const activeTab = this.tabs.find(tab => tab.isActive);
    if (activeTab) {
      const activeIndex = this.tabs.toArray().indexOf(activeTab);
      const activeContentTab = this.contentTabs.toArray()[activeIndex];
      console.log(1453)
      activeContentTab.saveFile();
    }
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
  }
}
