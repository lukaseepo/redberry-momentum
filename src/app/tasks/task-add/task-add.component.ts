import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgOptimizedImage} from '@angular/common';
import {Select} from 'primeng/select';
import {Status} from '../../shared/models/status';
import {Department} from '../../shared/models/department';
import {Priority} from '../../shared/models/priority';
import {Employee} from '../../shared/models/employee';
import {TasksService} from '../tasks.service';
import {PrimeTemplate} from 'primeng/api';
import {DatePickerModule} from 'primeng/datepicker';
import {ToastService} from '../../core/services/toast.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-task-add',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    Select,
    PrimeTemplate,
    DatePickerModule
  ],
  templateUrl: './task-add.component.html',
  styleUrl: './task-add.component.scss'
})
export class TaskAddComponent implements OnInit {
  public taskAddForm: FormGroup = new FormGroup({});
  public statuses!: Status[];
  public departments!: Department[];
  public priorities!: Priority[];
  public employees!: Employee[];

  constructor(private fb: FormBuilder, private taskService: TasksService, private toastService: ToastService, private router: Router) {
  }

  public ngOnInit() {
    this.getStatuses();
    this.getDepartments();
    this.getPriorities();
    this.getEmployees();
    this.taskAddForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255), Validators.pattern(/^(?=.*\S.*\S.*\S).*$/)]],
      description: ['', [Validators.maxLength(255), Validators.pattern(/^(?=(\S+\s+){3}\S+).*$/)]],
      due_date: [''],
      status_id: ['', Validators.required],
      priority_id: ['', Validators.required],
      employee_id: ['', Validators.required],
      department_id: ['', Validators.required]
    })
  }

  public getDepartments() {
    this.taskService.getDepartments().subscribe((res) => {
      this.departments = res;
    })
  }

  public getEmployees() {
    this.taskService.getEmployees().subscribe((res) => {
      this.employees = res;
      console.log(this.employees);
    })
  }

  public getPriorities() {
    this.taskService.getPriorities().subscribe((res) => {
      this.priorities = res;
    })
  }

  public getStatuses() {
    this.taskService.getStatuses().subscribe((res) => {
      this.statuses = res;
    })
  }

  public addTask() {
     this.taskAddForm.markAllAsTouched();
     if(this.taskAddForm.valid) {
       this.taskService.addTask(this.taskAddForm.value).subscribe(() => {
         this.router.navigate(['/']);
         this.toastService.showSuccess('თასქი წარმატებით დაემატა');
       })
     }
  }


}
