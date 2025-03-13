import { Routes } from '@angular/router';

export const routes: Routes = [{
  path: '',
  pathMatch: "full",
  redirectTo: 'tasks'
}, {
  path: 'tasks',
  loadComponent: () =>
    import('./tasks/tasks.component').then((x) => x.TasksComponent),
}];
