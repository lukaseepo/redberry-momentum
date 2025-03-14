import {Component, ElementRef, HostListener, OnInit} from '@angular/core';
import {TasksService} from '../../../tasks/tasks.service';
import {NgOptimizedImage} from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import {FormsModule} from '@angular/forms';
import {Department} from '../../models/department';
import {Priority} from '../../models/priority';
import {Employee} from '../../models/employee';

@Component({
  selector: 'app-filter',
  imports: [
    NgOptimizedImage,
    CheckboxModule,
    FormsModule,
  ],
  standalone: true,
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent implements OnInit {
  public showFilter = false;
  public showDepartmentFilter = false;
  public showPriorityFilter = false;
  public showEmployeeFilter = false;
  public departments!: Department[];
  public priorities!: Priority[];
  public employees!: Employee[];


  constructor(private taskService: TasksService, private elementRef: ElementRef) {
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    const filterElement = (event.target as HTMLElement).closest('.filter');
    if (!filterElement) {
      this.showFilter = false;
      this.showDepartmentFilter = false;
      this.showPriorityFilter = false;
      this.showEmployeeFilter = false;
    }
  }

  public showFilterOptions (showDepartment: boolean, showPriority: boolean, showEmployee: boolean) {
    this.showFilter = true;
    if(this.showDepartmentFilter && showDepartment) {
      this.showDepartmentFilter = false;
      this.showFilter = false;
      return;
    } else if (this.showPriorityFilter && showPriority) {
      this.showPriorityFilter = false;
      this.showFilter = false;
      return;
    } else if (this.showEmployeeFilter && showEmployee) {
      this.showEmployeeFilter = false;
      this.showFilter = false;
      return;
    }
    this.showDepartmentFilter = showDepartment;
    this.showPriorityFilter = showPriority;
    this.showEmployeeFilter = showEmployee;
  }

  public ngOnInit() {
    this.getDepartments();
    this.getPriorities();
    this.getEmployees();
  }

  public getDepartments() {
    this.taskService.getDepartments().subscribe((res) => {
      this.departments = res;
    })
  }

  public getEmployees() {
    this.taskService.getEmployees().subscribe((res) => {
      this.employees = res;
    })
  }

  public getPriorities() {
    this.taskService.getPriorities().subscribe((res) => {
      this.priorities = res;
    })
  }
}
