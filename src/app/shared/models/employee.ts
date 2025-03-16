import {Department} from './department';

export interface Employee {
  "name": String;
  "surname": String;
  "id": number;
  "avatar": String;
  "department": Department;
}
