import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {EmployeeAddComponent} from '../employee-add/employee-add.component';

@Component({
  selector: 'app-header',
  imports: [
    NgOptimizedImage
  ],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(private dialog: MatDialog) { }

  public openEmployeeAddDialog() {
    this.dialog.open(EmployeeAddComponent)
  }
}
