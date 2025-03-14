import { Injectable } from '@angular/core';
import {MessageService} from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  public constructor(private messageService: MessageService) {}

  public showSuccess(message: string, detail?: string): void {
    this.messageService.add({
      severity: 'success',
      detail: detail || message,
    });
  }


  public showError(message: string, detail?: string): void {
    this.messageService.add({
      severity: 'error',
      detail: detail || message,
    });
  }
}
