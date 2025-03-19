import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {SelectModule} from 'primeng/select';
import {TasksService} from '../../../tasks/tasks.service';
import {Department} from '../../models/department';
import {MAT_DIALOG_DATA, MatDialog, MatDialogClose} from '@angular/material/dialog';
import {ToastService} from '../../../core/services/toast.service';

@Component({
  selector: 'app-employee-add',
  imports: [
    NgOptimizedImage,
    ReactiveFormsModule,
    SelectModule,
    FormsModule,
    MatDialogClose,
  ],
  standalone: true,
  templateUrl: './employee-add.component.html',
  styleUrl: './employee-add.component.scss',
})
export class EmployeeAddComponent implements OnInit {
  public employeeAddForm: FormGroup = new FormGroup({});
  public imagePreview: string | null = null;
  public imageInvalid = false;
  public departments!: Department[];
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;


  constructor(private fb: FormBuilder, private dialog: MatDialog, private taskService: TasksService, private toastService: ToastService, @Inject(MAT_DIALOG_DATA) public data: {department_id: string}) {
  }

  public onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.handleImageUpload(file);
  }

  public getDepartments(): void {
    this.taskService.getDepartments().subscribe((res) => {
      this.departments = res;
    })
  }

  public ngOnInit(): void {
    this.getDepartments();
    this.employeeAddForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255), Validators.pattern(/^[ა-ჰa-zA-Z]+$/)]],
      surname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255),  Validators.pattern(/^[ა-ჰa-zA-Z]+$/)]],
      avatar: ['', Validators.required],
      department_id: ['', Validators.required],
    })

    if(this.data?.department_id) {
      this.employeeAddForm.patchValue({
        department_id: this.data.department_id
      })
    }
  }

  public removeImage(): void {
    this.imagePreview = null;
    this.imageInvalid = true;
    this.employeeAddForm.patchValue({
      avatar: null
    });
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  private handleImageUpload(file: File): void {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      this.employeeAddForm.patchValue({
        avatar: file
      });
      this.imageInvalid = file.size > 600000;
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  public submitForm(): void {
    this.employeeAddForm.markAllAsTouched();
    const employeeData = this.employeeAddForm.value;

    if(!this.imagePreview) {
      this.imageInvalid = true;
    }

    if(employeeData.avatar.size > 600000) {
      return;
    }

    if(this.employeeAddForm.valid) {
      const formData = new FormData();

      Object.keys(employeeData).forEach(key => {
        formData.append(key, employeeData[key]);
      });

      formData.append('avatar', employeeData.avatar, employeeData.avatar.name);

      this.taskService.addEmployee(formData).subscribe(() => {
        this.toastService.showSuccess("თანამშროემლი წარმატებით დაემატა");
        this.dialog.closeAll();
        this.taskService.employeeUpdateSignal.update(count => count + 1);
      })
    }
  }
}
