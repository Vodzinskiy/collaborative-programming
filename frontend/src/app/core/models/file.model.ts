import {UUID} from "crypto";

export class FileModel {
  id: UUID;
  name: string;
  data: string;
  content = undefined
  path?: string

  constructor(name: string, data: string, path?: string) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.data = data
    this.path = path
  }
}
