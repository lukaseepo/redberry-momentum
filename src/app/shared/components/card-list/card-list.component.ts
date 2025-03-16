import {Component, OnInit} from '@angular/core';
import {TaskCardComponent} from '../task-card/task-card.component';
import {HttpClient} from '@angular/common/http';
import {TasksService} from '../../../tasks/tasks.service';
import {Task} from '../../models/task';
import {Status} from '../../models/status';

@Component({
  selector: 'app-card-list',
  imports: [
    TaskCardComponent
  ],
  standalone: true,
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.scss'
})
export class CardListComponent implements OnInit {
  public allTasks!: Task[];
  public startTasks!: Task[];
  public statuses!: Status[];
  constructor(private taskService: TasksService) { }

  ngOnInit(): void {
    this.getAllTasks();
    this.getStatuses();
  }

  public getAllTasks(): void {
    this.taskService.getTasks().subscribe((res) => {
      this.allTasks = res;
    })
  }

  public getStatuses(): void {
    this.taskService.getStatuses().subscribe((res) => {
      this.statuses = res;
    })
  }
}
