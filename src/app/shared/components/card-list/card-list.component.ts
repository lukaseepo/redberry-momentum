import {Component, OnInit} from '@angular/core';
import {TaskCardComponent} from '../task-card/task-card.component';
import {HttpClient} from '@angular/common/http';
import {TasksService} from '../../../tasks/tasks.service';
import {Task} from '../../models/task';
import {Status} from '../../models/status';
import {FilterComponent} from '../filter/filter.component';

@Component({
  selector: 'app-card-list',
  imports: [
    TaskCardComponent,
    FilterComponent
  ],
  standalone: true,
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.scss'
})
export class CardListComponent implements OnInit {
  public allTasks!: Task[];
  public startTasks!: Task[];
  public progressTasks!: Task[];
  public testingTasks!: Task[];
  public filteredTasks!: Task[];
  public finishedTasks!: Task[];
  public statuses!: Status[];
  private tasksLoaded = false;
  private pendingFilters: { [type: string]: { [key: string]: boolean } } | null = null;
  constructor(private taskService: TasksService) { }

  ngOnInit(): void {
    this.getAllTasks();
    this.getStatuses();
  }

  public getAllTasks(): void {
    this.taskService.getTasks().subscribe((res) => {
      this.allTasks = res;
      this.filteredTasks = [...this.allTasks];
      this.tasksLoaded = true;
      if (this.pendingFilters) {
        this.onFilterChange(this.pendingFilters);
        this.pendingFilters = null;
      } else {
        this.updateTaskLists();
      }
    })
  }

  public getStatuses(): void {
    this.taskService.getStatuses().subscribe((res) => {
      this.statuses = res;
    })
  }

  private updateTaskLists(): void {
    this.startTasks = this.filteredTasks.filter(task => task.status.id === 1);
    this.progressTasks = this.filteredTasks.filter(task => task.status.id === 2);
    this.testingTasks = this.filteredTasks.filter(task => task.status.id === 3);
    this.finishedTasks = this.filteredTasks.filter(task => task.status.id === 4);
  }

  public onFilterChange(filterState: { [type: string]: { [key: string]: boolean } }): void {
    if (!this.tasksLoaded) {
      this.pendingFilters = filterState;
      return;
    }
    let filteredTasks = [...this.allTasks];

    const departmentFilters = filterState['department'];
    const activeDepartmentFilters = Object.entries(departmentFilters)
      .filter(([_, isActive]) => isActive)
      .map(([name, _]) => name);

    if (activeDepartmentFilters.length > 0) {
      filteredTasks = filteredTasks.filter(task =>
        task.department && activeDepartmentFilters.includes(task.department.name)
      );
    }

    const priorityFilters = filterState['priority'];
    const activePriorityFilters = Object.entries(priorityFilters)
      .filter(([_, isActive]) => isActive)
      .map(([name, _]) => name);
    if (activePriorityFilters.length > 0) {
      filteredTasks = filteredTasks.filter(task =>
        task.priority && activePriorityFilters.includes(task.priority.name)
      );
    }

    const employeeFilters = filterState['employee'];
    const activeEmployeeFilters = Object.entries(employeeFilters)
      .filter(([_, isActive]) => isActive)
      .map(([id, _]) => id);


    if (activeEmployeeFilters.length > 0) {
      filteredTasks = filteredTasks.filter(task =>
        task.employee && activeEmployeeFilters.includes(task.employee.id.toString())
      );
    }

    this.filteredTasks = filteredTasks;

    this.updateTaskLists();
  }
}
