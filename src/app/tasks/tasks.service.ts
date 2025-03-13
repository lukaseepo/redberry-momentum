import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment.dev';
import {Observable} from 'rxjs';
import {Department} from '../shared/models/department';
import {Priority} from '../shared/models/priority';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private http: HttpClient) { }

  public getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(environment.apiUrl + 'departments');
  }

  public getPriorities(): Observable<Priority[]> {
    return this.http.get<Priority[]>(environment.apiUrl + 'priorities');
  }
 }
