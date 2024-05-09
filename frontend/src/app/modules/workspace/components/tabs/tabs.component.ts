import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {ResizeService} from "../../services/resize.service";
import {MatTabGroup} from "@angular/material/tabs";


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss'
})
export class TabsComponent implements OnInit {
  width: number = 0;
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;

  constructor(protected resizeService: ResizeService) {}

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.resize()
  }

  tabs = [
    { title: 'Tab 1', content: 'Content for Tab 1' },
    { title: 'Tab 2', content: 'Content for Tab 2' },
    { title: 'Tab 3', content: 'Content for Tab 3' },
    { title: 'Tab 1', content: 'Content for Tab 1' },
    { title: 'Tab 2', content: 'Content for Tab 2' },
    { title: 'Tab 3', content: 'Content for Tab 3' },
    { title: 'Tab 1', content: 'Content for Tab 1' },
    { title: 'Tab 2', content: 'Content for Tab 2' },
    { title: 'Tab 3', content: 'Content for Tab 3' },
  ];

  closeTab(index: number) {
    this.tabs.splice(index, 1);
  }

  resize()  {
    this.resizeService.currentLeftWidth.subscribe(value => {
      this.width = window.innerWidth - value;
      this.tabGroup.updatePagination()
    });
  }

  ngOnInit(): void {
    this.resize()
  }
}
