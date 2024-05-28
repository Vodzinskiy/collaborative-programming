import {UUID} from "crypto";

export class FileModel {
  id: UUID;
  name: string;
  data: string;
  content = undefined
  fPath?: string

  constructor(id: UUID | undefined, name: string, data: string, fPath?: string) {
    this.id = id ? id : crypto.randomUUID();
    this.name = name;
    this.data = data
    this.fPath = fPath
  }
}
