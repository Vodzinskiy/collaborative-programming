export interface Project {
  id: string;
  name: string;
  owner: string;
  members: string[];
  role: Role;
}

export enum Role {
  OWNER = 'OWNER',
}
