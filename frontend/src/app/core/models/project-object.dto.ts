import {UUID} from "crypto";

export interface ProjectObject {
  id?: UUID;
  type: 'directory' | 'file';
  path: string;
  name: string;
  content?: string;
  fPath: string;
}
