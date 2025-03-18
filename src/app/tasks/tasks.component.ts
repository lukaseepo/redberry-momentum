import {Component, OnInit} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {TasksService} from './tasks.service';
import {FilterComponent} from '../shared/components/filter/filter.component';
import {CardListComponent} from '../shared/components/card-list/card-list.component';

@Component({
  selector: 'app-tasks',
  imports: [
    CardListComponent
  ],
  standalone: true,
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent {

}
