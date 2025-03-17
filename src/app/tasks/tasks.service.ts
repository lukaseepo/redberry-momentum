import {Injectable, signal} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment.dev';
import {Observable} from 'rxjs';
import {Department} from '../shared/models/department';
import {Priority} from '../shared/models/priority';
import {Employee} from '../shared/models/employee';
import {Status} from '../shared/models/status';
import {Task} from '../shared/models/task';
import {Comment} from '../shared/models/comment';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private apiToken = '9e6dcd97-1d26-4469-b686-6b76c8d9a2bf';
  public employeeUpdateSignal = signal<number>(0);


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

  public addTask(task: Task): Observable<Task[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.apiToken
    });

    const options = { headers: headers };

    return this.http.post<Task[]>(environment.apiUrl + 'tasks', task, options);
  }

  public getTaskById(id: number): Observable<Task> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.apiToken
    });

    const options = { headers: headers };

    return this.http.get<Task>(environment.apiUrl + 'tasks/' + id, options);
  }

  public updateTaskById(id: number, task: {status_id: number}): Observable<Task> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.apiToken
    });

    const options = { headers: headers };

    return this.http.put<Task>(environment.apiUrl + 'tasks/' + id, task, options);
  }

  public postComment(id:number, comment: {text: string, parent_id?: number}): Observable<Comment[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.apiToken
    });

    const options = { headers: headers };

    return this.http.post<Comment[]>(environment.apiUrl + 'tasks/' + id + '/comments', comment, options);
  }

  public getAllComments(id:number): Observable<Comment[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.apiToken
    });

    const options = { headers: headers };

    return this.http.get<Comment[]>(environment.apiUrl + 'tasks/' + id + '/comments', options);
  }


  public getTasks(): Observable<Task[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.apiToken
    });

    const options = { headers: headers };

    return this.http.get<Task[]>(environment.apiUrl + 'tasks', options);
  }
}
