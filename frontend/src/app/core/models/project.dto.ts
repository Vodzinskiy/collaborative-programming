import {User} from "./user.dto";

export interface Project {
  id: string;
  name: number;
  owner?: User;
  members?: string[];
  role: Role;
}

export enum Role {
  OWNER = 'OWNER',
}
