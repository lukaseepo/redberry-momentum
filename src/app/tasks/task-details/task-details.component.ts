import {Component, LOCALE_ID, OnInit} from '@angular/core';
import {DatePipe, NgOptimizedImage, registerLocaleData} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Select} from 'primeng/select';
import {TasksService} from '../tasks.service';
import {ActivatedRoute} from '@angular/router';
import {Task} from '../../shared/models/task';
import localeKa from '@angular/common/locales/ka';
import {Colors} from '../../core/constants/constants';
import {Status} from '../../shared/models/status';
import {ToastService} from '../../core/services/toast.service'; // Georgian locale

registerLocaleData(localeKa);

@Component({
  selector: 'app-task-details',
  imports: [
    NgOptimizedImage,
    FormsModule,
    ReactiveFormsModule,
    Select,
    DatePipe
  ],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss',
  providers: [{ provide: LOCALE_ID, useValue: 'ka' }]
})
export class TaskDetailsComponent implements OnInit {
  private taskId = 0;
  public task!: Task;
  public statuses!: Status[];
  public colors = Colors;
  public taskStatus = 0;

  constructor(private taskService: TasksService, private route: ActivatedRoute, private toastService: ToastService) {
  }

  ngOnInit() {
    this.taskId = this.route.snapshot.params['id'];
    this.getTaskById();
    this.getDepartments();
  }

  public getDepartments(): void {
    this.taskService.getStatuses().subscribe((departments) => {
      this.statuses = departments;
    })
  }

  public selectValueChanged(event: number) {
    this.taskService.updateTaskById(this.taskId, {status_id: event}).subscribe(() => {
      this.toastService.showSuccess('სტატუსი წარმატებით შეიცვალა');
    })
  }

  public getTaskById() {
    this.taskService.getTaskById(this.taskId).subscribe((task) => {
      this.task = task;
      this.taskStatus = this.task.status.id;
    })
  }

}
