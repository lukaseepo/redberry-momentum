import { Routes } from '@angular/router';

export const routes: Routes = [{
  path: '',
  pathMatch: "full",
  redirectTo: 'tasks'
}, {
    path: 'tasks',
    loadComponent: () =>
    import('./tasks/tasks.component').then((x) => x.TasksComponent),
}, {
    path: 'task-add',
    loadComponent: () => import('./tasks/task-add/task-add.component').then((x) => x.TaskAddComponent),
}, {
    path: 'task-details/:id',
    loadComponent: () => import('./tasks/task-details/task-details.component').then((x) => x.TaskDetailsComponent),
  }
];
