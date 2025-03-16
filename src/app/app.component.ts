import { Component } from '@angular/core';
import {HeaderComponent} from './shared/components/header/header.component';
import {RouterOutlet} from '@angular/router';
import {HttpClient, HttpClientModule, provideHttpClient} from '@angular/common/http';
import {Toast} from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [
    HeaderComponent,
    RouterOutlet,
    Toast
  ],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
