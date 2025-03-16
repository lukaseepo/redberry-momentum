import {Department} from './department';

export interface Employee {
  "name": string;
  "surname": string;
  "id": number;
  "avatar": string;
  "department": Department;
}
