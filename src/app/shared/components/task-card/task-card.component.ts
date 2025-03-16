import {Component, Input} from '@angular/core';
import {DatePipe, NgClass, NgOptimizedImage} from '@angular/common';
import {RouterLink} from '@angular/router';
import {Colors} from '../../../core/constants/constants';

@Component({
  selector: 'app-task-card',
  imports: [
    NgOptimizedImage,
    DatePipe,
    RouterLink
  ],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {
  @Input() public taskCardClass = '';
  @Input() public priority = '';
  @Input() public priorityIcon = '';
  @Input() public department_id = 0;
  @Input() public task_id = 0;
  @Input() public avatar = '';
  @Input() public department = '';
  @Input() public name = '';
  @Input() public due_date = '';
  @Input() public description = '';
  @Input() public comments: number = 0;
  public colors = Colors;
}
