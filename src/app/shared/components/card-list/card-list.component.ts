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
  public finishedTasks!: Task[];
  public statuses!: Status[];
  constructor(private taskService: TasksService) { }

  ngOnInit(): void {
    this.getAllTasks();
    this.getStatuses();
  }

  public getAllTasks(): void {
    this.taskService.getTasks().subscribe((res) => {
      this.allTasks = res;
      this.startTasks = this.allTasks.filter(task => task.status.id === 1);
      this.progressTasks = this.allTasks.filter(task => task.status.id === 2);
      this.testingTasks = this.allTasks.filter(task => task.status.id === 3);
      this.finishedTasks = this.allTasks.filter(task => task.status.id === 4);
    })
  }

  public getStatuses(): void {
    this.taskService.getStatuses().subscribe((res) => {
      this.statuses = res;
    })
  }

  public onFilterChange(event: {[key: string]: boolean}[]) {
    const employee_filter = event[0];
    const priority_filter = event[1];
    const department_filters = event[2];
    console.log(employee_filter);
  }
}
