import {Component, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {SocketService} from "../../../../core/services/socket.service";
import {ResizeService} from "../../services/resize.service";
import {FileModel} from "../../../../core/models/file.model";

@Component({
  selector: 'app-document-content',
  templateUrl: './document-content.component.html',
  styleUrl: './document-content.component.scss'
})
export class DocumentContentComponent implements OnInit, OnDestroy {
  @Input() file!: FileModel
  private documentUpdatedSubscription!: Subscription;
  width: number = 0;
  isRemoteChange = false;
  editor: any;
  editorOptions = {theme: 'vs-dark', language: 'typescript', automaticLayout: true};

  constructor(private socketService: SocketService, protected resizeService: ResizeService) {}

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.resize()
  }

  ngOnInit(): void {
    this.socketService.documentUpdated().subscribe((operations: any) => {
      this.isRemoteChange = true;
      this.editor.getModel().applyEdits(operations);
    });
    this.resize();
  }

  ngOnDestroy(): void {
    this.documentUpdatedSubscription.unsubscribe();
  }

  resize() {
    this.resizeService.currentLeftWidth.subscribe(value => {
      this.width = window.innerWidth - value;
    });
  }

  onEditorInit(editor: any) {
    this.editor = editor;
    this.editor.onDidChangeModelContent((event: any) => {
      if (!this.isRemoteChange) {
        const operations = event.changes.map((change: any) => ({
          range: change.range,
          text: change.text,
          rangeLength: change.rangeLength,
          rangeOffset: change.rangeOffset,
        }));
        this.socketService.updateDocument(operations, this.file.id);
      }
      this.isRemoteChange = false;
    });
  }
}
