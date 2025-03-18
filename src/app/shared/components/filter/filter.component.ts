import {Component, EventEmitter, HostListener, OnDestroy, OnInit, Output} from '@angular/core';
import {TasksService} from '../../../tasks/tasks.service';
import {Department} from '../../models/department';
import {Priority} from '../../models/priority';
import {Employee} from '../../models/employee';
import {NgOptimizedImage} from '@angular/common';
import {CheckboxModule} from 'primeng/checkbox';
import {FormsModule} from '@angular/forms';
import {filter, Subscription} from 'rxjs';
import {NavigationStart, Router} from '@angular/router';

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

export class FilterComponent implements OnInit, OnDestroy {
  @Output() public filterChange: EventEmitter<any> = new EventEmitter();
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
  private routerSubscription!: Subscription;
  private readonly STORAGE_KEY = 'task_filters';


  private loadFiltersFromStorage(): void {
    const storedFilters = sessionStorage.getItem(this.STORAGE_KEY);
    if (storedFilters) {
      const parsedData = JSON.parse(storedFilters);
      this.savedFilters = parsedData.savedFilters || [];

      if (parsedData.department_filters) {
        this.department_filters = parsedData.department_filters;
      }

      if (parsedData.priority_filters) {
        this.priority_filters = parsedData.priority_filters;
      }

      if (parsedData.employee_filters) {
        this.employee_filters = parsedData.employee_filters;
      }

      this.emitFilterChanges();
    }
  }

  private saveFiltersToStorage(): void {
    const filtersData = {
      savedFilters: this.savedFilters,
      department_filters: this.department_filters,
      priority_filters: this.priority_filters,
      employee_filters: this.employee_filters
    };

    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtersData));
  }

  private clearStoredFilters(): void {
    sessionStorage.removeItem(this.STORAGE_KEY);
  }


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
    this.saveFiltersToStorage();
    this.emitFilterChanges();
  }

  public clearFilter() {
    this.savedFilters = [];
    this.department_filters = {};
    this.priority_filters = {};
    this.employee_filters = {};
    this.clearStoredFilters();
    this.emitFilterChanges();
  }

  constructor(private taskService: TasksService, private router: Router) {
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe(() => {
        this.clearStoredFilters();
      });
  }

  private updateFilters(filterObject: Record<string, boolean>, filterType: string) {
    this.savedFilters = this.savedFilters.filter((filter: { type: string; }) => filter.type !== filterType);
    if(filterType === 'employee') {
      Object.entries(filterObject).forEach(([key, value]) => {
        const employee = this.employees.find(e => e.id === +key);
        if (value && employee) {
          this.savedFilters.push({ name: employee.name + " " + employee?.surname, value: key, type: filterType });
        }
      });
    } else {
      Object.entries(filterObject).forEach(([key, value]) => {
        if (value) {
          this.savedFilters.push({ name: key, value, type: filterType });
        }
      });
    }


    this.showFilterOptions(false, false, false);

    this.saveFiltersToStorage();
    this.showFilter = false;
    this.emitFilterChanges();
  }

  public filterDepartments() {
    this.updateFilters(this.department_filters, 'department');
  }

  public filterEmployees() {
    this.updateFilters(this.employee_filters, 'employee');
  }

  public filterPriorities() {
    this.updateFilters(this.priority_filters, 'priority');
  }

  private emitFilterChanges() {
    const filterState = {
      department: { ...this.department_filters },
      employee: { ...this.employee_filters },
      priority: { ...this.priority_filters }
    };

    this.filterChange.emit(filterState);
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
    this.loadFiltersFromStorage();
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

  public ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }
}
