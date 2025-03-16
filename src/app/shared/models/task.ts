import {Status} from './status';
import {Priority} from './priority';
import {Department} from './department';
import {Employee} from './employee';

export interface Task {
  id: number;
  name: string;
  description: string;
  due_date: number;
  status: Status;
  priority: Priority;
  department: Department;
  employee: Employee;
}
