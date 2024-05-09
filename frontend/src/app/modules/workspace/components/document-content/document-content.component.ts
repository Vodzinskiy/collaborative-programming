import {Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {SocketService} from "../../services/socket.service";
import {ResizeService} from "../../services/resize.service";

@Component({
  selector: 'app-document-content',
  templateUrl: './document-content.component.html',
  styleUrl: './document-content.component.scss'
})
export class DocumentContentComponent implements OnInit, OnDestroy  {
  protected content: string = '';
  private previousDocumentLength: number = 0;
  documentId: string = '1';
  private documentUpdatedSubscription!: Subscription;
  width: number = 0;

  editorOptions = {theme: 'vs-dark', language: 'typescript',
    automaticLayout: true};

  constructor(private socketService: SocketService, protected resizeService: ResizeService) {}

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.resize()
  }

  ngOnInit(): void {
    this.documentUpdatedSubscription = this.socketService.documentUpdated().subscribe(change => {
      if (change.length > 0) {
        this.content = this.content.substring(0, change.position) + change.content + this.content.substring(change.position);
      } else {
        this.content = this.content.substring(0, change.position+1) + this.content.substring(change.position + Math.abs(change.length)+1);
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
    }, this.documentId);
  }

  resize()  {
    this.resizeService.currentLeftWidth.subscribe(value => {
      this.width = window.innerWidth - value;
    });
  }
}
