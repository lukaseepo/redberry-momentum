import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment.dev';
import {Observable} from 'rxjs';
import {Department} from '../shared/models/department';
import {Priority} from '../shared/models/priority';
import {Employee} from '../shared/models/employee';
import {Status} from '../shared/models/status';
import {Task, TaskAdd} from '../shared/models/task';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private apiToken = '9e6dcd97-1d26-4469-b686-6b76c8d9a2bf';

  constructor(private http: HttpClient) { }

  public getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(environment.apiUrl + 'departments');
  }

  public getPriorities(): Observable<Priority[]> {
    return this.http.get<Priority[]>(environment.apiUrl + 'priorities');
  }

  public getStatuses(): Observable<Status[]> {
    return this.http.get<Status[]>(environment.apiUrl + 'statuses');
  }

  public getEmployees(): Observable<Employee[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.apiToken
    });

    const options = { headers: headers };
    return this.http.get<Employee[]>(environment.apiUrl + 'employees', options);
  }

  public addEmployee(employee: FormData): Observable<Employee[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.apiToken
    });

    const options = { headers: headers };

    return this.http.post<Employee[]>(environment.apiUrl + 'employees', employee, options);
  }

  public addTask(task: TaskAdd): Observable<Task[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.apiToken
    });

    const options = { headers: headers };

    return this.http.post<Task[]>(environment.apiUrl + 'tasks', task, options);
  }
}
