import {UUID} from "crypto";

export class FileModel {
  id: UUID;
  name: string;
  data: string;
  content = undefined

  constructor(name: string, data: string) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.data = data
  }
}
