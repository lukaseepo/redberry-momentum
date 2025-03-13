import { Component } from '@angular/core';
import {TaskCardComponent} from '../task-card/task-card.component';

@Component({
  selector: 'app-card-list',
  imports: [
    TaskCardComponent
  ],
  standalone: true,
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.scss'
})
export class CardListComponent {

}
