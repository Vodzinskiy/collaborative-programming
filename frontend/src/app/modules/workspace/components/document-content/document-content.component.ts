import {Component, HostListener, Input, OnInit} from '@angular/core';
import {ResizeService} from "../../services/resize.service";
import {FileModel} from "../../../../core/models/file.model";
import {FileSocketService} from "../../../../core/services/file-socket.service";
import { languageExtensions } from '../../../../../assets/language-extensions';

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
  editorOptions = {theme: 'vs-dark', language:"java", automaticLayout: true};
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

  getLanguageFromExtension(fileName: string): string {
    const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
    return languageExtensions[fileExtension] || 'plaintext';
  }

  resize() {
    this.resizeService.currentLeftWidth.subscribe(value => {
      this.width = window.innerWidth - value;
    });
  }

  onEditorInit(editor: any) {
    this.editor = editor;
    this.editor.language = this.getLanguageFromExtension(this.file.name)
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
