import {Component, HostListener, OnInit} from '@angular/core';
import {TasksService} from '../../../tasks/tasks.service';
import {NgOptimizedImage} from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import {FormsModule} from '@angular/forms';
import {Department} from '../../models/department';
import {Priority} from '../../models/priority';

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


  constructor(private taskService: TasksService) {
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
  }

  public getDepartments() {
    this.taskService.getDepartments().subscribe((res) => {
      this.departments = res;
    })
  }

  public getPriorities() {
    this.taskService.getPriorities().subscribe((res) => {
      this.priorities = res;
      console.log(this.priorities);
    })
  }
}
