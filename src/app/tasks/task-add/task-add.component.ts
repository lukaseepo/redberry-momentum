import {Component, effect, EffectRef, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {NgOptimizedImage, registerLocaleData} from '@angular/common';
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
import {maxNonSpaceCharsValidator} from '../../core/validators/char-validator';
import {of, switchMap, tap} from 'rxjs';
import localeKa from '@angular/common/locales/ka';


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
  standalone: true,
  templateUrl: './task-add.component.html',
  styleUrl: './task-add.component.scss',
})
export class TaskAddComponent implements OnInit, OnDestroy {
  public taskAddForm: FormGroup = new FormGroup({});
  public statuses!: Status[];
  public departments!: Department[];
  public priorities!: Priority[];
  public employees!: Employee[];
  private allEmployees: Employee[] = [];
  private effectRef!: EffectRef;
  public firstLoad = true;
  private defaultDate: Date = new Date();
  public minDate: Date = new Date();

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
    this.minDate.setHours(0, 0, 0, 0);
    this.defaultDate.setDate(this.defaultDate.getDate() + 1);
    this.getStatuses();
    this.getDepartments();
    this.getPriorities();
    this.getEmployees();

    this.taskAddForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), maxNonSpaceCharsValidator(255), Validators.pattern(/^(?=.*\S.*\S.*\S).*$/)]],
      description: ['', [maxNonSpaceCharsValidator(255), Validators.pattern(/^(?=(\S+\s+){3}\S+).*$/)]],
      due_date: ['', [Validators.required]],
      status_id: ['', Validators.required],
      priority_id: ['', Validators.required],
      employee_id: [{value: '', disabled: true}, Validators.required],
      department_id: ['', Validators.required]
    })
    this.taskAddForm.get('department_id')?.valueChanges.subscribe(() => {
      this.taskAddForm.get('employee_id')?.enable();
      if(!this.firstLoad){
        this.taskAddForm.get('employee_id')?.setValue('');
      }
      this.firstLoad = false;
      this.employees = this.allEmployees.filter(employee => employee.department.id === this.taskAddForm.get('department_id')?.value);
    })

    this.taskAddForm.valueChanges.subscribe((v) => {
      this.saveFormToLocalStorage();
    });
  }

  public getDepartments() {
    this.taskService.getDepartments().subscribe((res) => {
      this.departments = res;
    })
  }

  public  getEmployees() {
    const savedData = this.loadFormFromLocalStorage();
    this.taskService.getEmployees().pipe(
      tap(res => {
        this.employees = res;
        this.allEmployees = res;
      }),
      switchMap(() => {
        if (savedData) {
          if (savedData.due_date) {
            savedData.due_date = new Date(savedData.due_date);
          } else {
            delete savedData.due_date;
          }

          if (savedData.department_id) {
            this.taskAddForm.get('employee_id')?.enable();
          } else {
            delete savedData.department_id;
          }

          this.taskAddForm.patchValue(savedData);

          const fieldsToCheck = ['name', 'description', 'employee_id', 'department_id', 'due_date'];

          fieldsToCheck.forEach(field => {
            if (this.taskAddForm.get(field)?.value) {
              this.taskAddForm.get(field)?.markAsTouched();
            }
          });
        } else {
          this.taskAddForm.patchValue({
            due_date: this.defaultDate,
          })
        }
        return of(null);
      })
    ).subscribe();
  }

  public getPriorities() {
    this.taskService.getPriorities().subscribe((res) => {
      this.priorities = res;
      this.taskAddForm.patchValue({
        priority_id: this.priorities[1].id
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
         this.toastService.showSuccess('დავალება წარმატებით დაემატა');
         localStorage.removeItem('taskAddFormData');
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
