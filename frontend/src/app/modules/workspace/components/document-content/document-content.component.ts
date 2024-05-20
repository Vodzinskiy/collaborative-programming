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
export class DocumentContentComponent implements OnInit, OnDestroy  {
  @Input() file!: FileModel
  private previousDocumentLength: number = 0;
  private documentUpdatedSubscription!: Subscription;
  width: number = 0;

  editorOptions = {theme: 'vs-dark', language: 'typescript', automaticLayout: true};

  constructor(private socketService: SocketService, protected resizeService: ResizeService) {}

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.resize()
  }

  ngOnInit(): void {
    this.documentUpdatedSubscription = this.socketService.documentUpdated().subscribe(change => {

      if (change.length > 0) {
        this.file.data = this.file.data.substring(0, change.position) + change.content + this.file.data.substring(change.position);
      } else {
        this.file.data = this.file.data.substring(0, change.position+1) + this.file.data.substring(change.position + Math.abs(change.length)+1);
      }
      this.previousDocumentLength += change.length
    });
    this.resize();
  }

  ngOnDestroy(): void {
    this.documentUpdatedSubscription.unsubscribe();
  }

  onDocumentChange(event: any): void {
    const textarea = event.target as HTMLTextAreaElement;
    const newValue = textarea.value;

    const cursorPosition = textarea.selectionStart;
    const changeLength = newValue.length - this.previousDocumentLength
    const addedChars = newValue.slice(cursorPosition - changeLength, cursorPosition);
    this.previousDocumentLength = newValue.length;

    this.socketService.updateDocument({
      content: addedChars,
      position: cursorPosition - 1,
      length: changeLength
    }, this.file.id);
  }

  resize()  {
    this.resizeService.currentLeftWidth.subscribe(value => {
      this.width = window.innerWidth - value;
    });
  }

  saveFile() {
    console.log(this.file)
  }
}
