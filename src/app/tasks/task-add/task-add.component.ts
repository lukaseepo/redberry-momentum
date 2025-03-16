import {Component, effect, EffectRef, OnDestroy, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
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
import {MatDialog} from '@angular/material/dialog';
import {EmployeeAddComponent} from '../../shared/components/employee-add/employee-add.component';

@Component({
  selector: 'app-task-add',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    Select,
    PrimeTemplate,
    DatePickerModule,
    NgOptimizedImage,
  ],
  templateUrl: './task-add.component.html',
  styleUrl: './task-add.component.scss'
})
export class TaskAddComponent implements OnInit, OnDestroy {
  public taskAddForm: FormGroup = new FormGroup({});
  public statuses!: Status[];
  public departments!: Department[];
  public priorities!: Priority[];
  public employees!: Employee[];
  private allEmployees: Employee[] = [];
  private effectRef!: EffectRef;
  minDate: Date = new Date();
  defaultDate: Date = new Date();

  constructor(private fb: FormBuilder, private dialog: MatDialog, private taskService: TasksService, private toastService: ToastService, private router: Router) {
    this.effectRef = effect(() => {
      const triggerCount = this.taskService.employeeUpdateSignal();

      if (triggerCount > 0) {
        this.getEmployees();
      }
    });
  }

  private saveFormToLocalStorage() {
    const formValue = this.taskAddForm.getRawValue();
    localStorage.setItem('taskAddFormData', JSON.stringify(formValue));
  }

  private loadFormFromLocalStorage(): any {
    const savedData = localStorage.getItem('taskAddFormData');
    return savedData ? JSON.parse(savedData) : null;
  }

  public ngOnInit() {
    this.defaultDate.setDate(this.defaultDate.getDate() + 1);
    this.taskAddForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255), Validators.pattern(/^(?=.*\S.*\S.*\S).*$/)]],
      description: ['', [Validators.maxLength(255), Validators.pattern(/^(?=(\S+\s+){3}\S+).*$/)]],
      due_date: [this.defaultDate, [Validators.required]],
      status_id: ['', Validators.required],
      priority_id: ['', Validators.required],
      employee_id: [{value: '', disabled: true}, Validators.required],
      department_id: ['', Validators.required]
    })

    this.getStatuses();
    this.getDepartments();
    this.getPriorities();
    const savedData = this.loadFormFromLocalStorage();
    if (savedData) {
      if (savedData.due_date) {
        savedData.due_date = new Date(savedData.due_date);
      }

      this.taskAddForm.patchValue(savedData);

      if (savedData.department_id) {
        this.taskAddForm.get('employee_id')?.enable();
      }

      this.taskService.getEmployees().subscribe((res) => {
        this.employees = res;
        this.allEmployees = res;

        this.employees = this.allEmployees.filter(employee => employee.department.id === this.taskAddForm.get('department_id')?.value);
      })

    } else {
      this.getEmployees();
    }

    this.taskAddForm.get('department_id')?.valueChanges.subscribe(() => {
      this.taskAddForm.get('employee_id')?.enable();
      this.employees = this.allEmployees.filter(employee => employee.department.id === this.taskAddForm.get('department_id')?.value);
    })

    this.taskAddForm.valueChanges.subscribe(() => {
      this.saveFormToLocalStorage();
    });
  }

  public getDepartments() {
    this.taskService.getDepartments().subscribe((res) => {
      this.departments = res;
    })
  }

  public getEmployees() {
    this.taskService.getEmployees().subscribe((res) => {
      this.employees = res;
      this.allEmployees = res;
    })
  }

  public getPriorities() {
    this.taskService.getPriorities().subscribe((res) => {
      this.priorities = res;
      this.taskAddForm.patchValue({
        priority_id: this.priorities[0].id
      })
    })
  }

  public getStatuses() {
    this.taskService.getStatuses().subscribe((res) => {
      this.statuses = res;
      this.taskAddForm.patchValue({
        status_id: this.statuses[0].id
      })
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

  public openAddEmployeeDialog() {
    this.dialog.open(EmployeeAddComponent, {
      data: {
        department_id: this.taskAddForm.get('department_id')?.value,
      }
    });
  }

  public ngOnDestroy() {
    this.effectRef.destroy();
  }

}
