import {Component, HostListener, Input, OnInit} from '@angular/core';
import {ResizeService} from "../../services/resize.service";
import {FileModel} from "../../../../core/models/file.model";
import {FileSocketService} from "../../../../core/services/file-socket.service";

@Component({
  selector: 'app-document-content',
  templateUrl: './document-content.component.html',
  styleUrl: './document-content.component.scss'
})
export class DocumentContentComponent implements OnInit {
  @Input() file!: FileModel
  width: number = 0;
  isRemoteChange = false;
  editor: any;
  editorOptions = {theme: 'vs-dark', language: 'typescript', automaticLayout: true};
  constructor(private socket: FileSocketService, protected resizeService: ResizeService) {}

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.resize()
  }

  ngOnInit(): void {
    this.socket.documentUpdated(this.file.id).subscribe((operations: any) => {
      if (this.editor && this.editor.getModel()) {
        this.isRemoteChange = true;
        this.editor.getModel().applyEdits(operations);
      }
    });
    this.resize();
  }

  resize() {
    this.resizeService.currentLeftWidth.subscribe(value => {
      this.width = window.innerWidth - value;
    });
  }

  onEditorInit(editor: any) {
    this.editor = editor;
    this.editor.onDidChangeModelContent((event: any) => {
      if (!this.isRemoteChange && !event.isFlush) {
        const operations = event.changes.map((change: any) => ({
          range: change.range,
          text: change.text,
          rangeLength: change.rangeLength,
          rangeOffset: change.rangeOffset,
        }));
        this.socket.updateDocument(operations, this.file.id);
      }
      this.isRemoteChange = false;
    });
  }
}
