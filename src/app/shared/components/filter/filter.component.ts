import {Component, ElementRef, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
import {TasksService} from '../../../tasks/tasks.service';
import {Department} from '../../models/department';
import {Priority} from '../../models/priority';
import {Employee} from '../../models/employee';
import {NgOptimizedImage} from '@angular/common';
import {CheckboxModule} from 'primeng/checkbox';
import {FormsModule} from '@angular/forms';

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
  @Output() public onFilterChange: EventEmitter<any> = new EventEmitter();
  public showFilter = false;
  public showDepartmentFilter = false;
  public showPriorityFilter = false;
  public selectedEmployeeId: number | null = null;
  public showEmployeeFilter = false;
  public departments!: Department[];
  public priorities!: Priority[];
  public employees!: Employee[];
  public savedFilters: any = [];
  public department_filters: {[key: string]: boolean} = {};

  public priority_filters: {[key: string]: boolean} = {}

  public employee_filters: {[key: string]: boolean} = {}


  public selectSingleEmployee(employeeId: number): void {
    if (this.selectedEmployeeId === employeeId) {
      this.selectedEmployeeId = null;
    } else {
      this.selectedEmployeeId = employeeId;
    }

    for (const id in this.employee_filters) {
      this.employee_filters[id] = false;
    }

    if (this.selectedEmployeeId !== null) {
      this.employee_filters[this.selectedEmployeeId] = true;
    }
  }

  public removeFilter(filterName: string, employeeId: string) {
    this.savedFilters = this.savedFilters.filter((f: { name: string; }) => f.name !== filterName);

    if (this.department_filters[filterName] !== undefined) {
      this.department_filters[filterName] = false;
    }
    if (this.priority_filters[filterName] !== undefined) {
      this.priority_filters[filterName] = false;
    }
    if (this.employee_filters[employeeId] !== undefined) {
      this.employee_filters[employeeId] = false;
    }
  }

  public clearFilter() {
    this.savedFilters = [];
    this.department_filters = {};
    this.priority_filters = {};
    this.employee_filters = {};
  }

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
