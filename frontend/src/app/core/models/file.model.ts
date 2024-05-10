import {UUID} from "crypto";

export class FileModel {
  id: UUID;
  title: string;
  content: string;

  constructor(title: string, content: string) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.content = content
  }
}
