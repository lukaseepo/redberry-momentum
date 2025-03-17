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
import {ToastService} from '../../core/services/toast.service';
import {Comment} from '../../shared/models/comment'; // Georgian locale

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
  public comment: string = '';
  public statuses!: Status[];
  public colors = Colors;
  public showReplyAreas: boolean[] = [];
  public replyTexts: string[] = [];
  public taskStatus = 0;
  public comments!: Comment[];

  constructor(private taskService: TasksService, private route: ActivatedRoute, private toastService: ToastService) {
  }

  ngOnInit() {
    this.taskId = this.route.snapshot.params['id'];
    this.getTaskById();
    this.getDepartments();
    this.getAllComments();
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

  public reply(index: number) {
     this.showReplyAreas[index] = !this.showReplyAreas[index];

     if (this.replyTexts[index] === undefined) {
       this.replyTexts[index] = '';
     }
  }

  public postComment(parent_id?: number, index?: number) {
    if(!parent_id && this.comment) {
      this.taskService.postComment(this.taskId, {text: this.comment}).subscribe(() => {
        this.toastService.showSuccess('კომენტარი წარმატებით დაემატა')
        this.getAllComments();
      })
      this.comment = '';
      return;
    }

    if(this.replyTexts[index as number]) {
      this.taskService.postComment(this.taskId, {text: this.replyTexts[index as number], parent_id: parent_id}).subscribe(() => {
        this.toastService.showSuccess('კომენტარი წარმატებით დაემატა')
        this.getAllComments();
      })
      this.showReplyAreas[index as number] = !this.showReplyAreas[index as number];
      this.replyTexts[index as number] = '';
    }
  }

  public getAllComments() {
    this.taskService.getAllComments(this.taskId).subscribe((res) => {
      this.comments = res;
    })
  }

  public getTaskById() {
    this.taskService.getTaskById(this.taskId).subscribe((task) => {
      this.task = task;
      this.taskStatus = this.task.status.id;
    })
  }

}
