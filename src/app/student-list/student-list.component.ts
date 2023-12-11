import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StudentService } from './students.service';
import { Observable, map, switchMap } from 'rxjs';
import { Student } from './student.interface';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { University } from './university.interface';
import { UniversityService } from './university.service';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DropdownModule,
    DialogModule,
    ToastModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [StudentService, UniversityService, MessageService],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss',
})
export class StudentListComponent implements OnInit {
  students$: Observable<Student[]> = this.studentService.students$;

  universities$: Observable<University[]> =
    this.universityService.universities$;

  loading: boolean = true;

  visible = false;
  newStudentForm = new FormGroup({
    name: new FormControl<string | null>(null, [Validators.required]),
    age: new FormControl<number | null>(null, [Validators.required]),
    university: new FormControl<University | null>(null, [Validators.required]),
  });

  selectedUniversity: University = {} as University;

  constructor(
    private studentService: StudentService,
    private universityService: UniversityService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loading = false;
    this.universityService.getUniversities().subscribe((universities) => {
      console.log(universities);
    });
    this.studentService.getStudents().subscribe((students) => {
      console.log(students);
    });
  }

  openModal() {
    this.visible = true;
  }

  addStudent() {
    if (!this.newStudentForm.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation errors',
      });
      return;
    }

    this.studentService
      .addStudent(this.newStudentForm.getRawValue() as Student)
      .pipe(
        switchMap((result) => {
          return this.studentService.getStudents().pipe(map((r) => result));
        })
      )
      .subscribe((res) => {
        console.log(res);
        this.messageService.add({
          severity: 'info',
          summary: 'Successfully added student',
        });
        this.visible = false;
        this.newStudentForm.reset();
      });
  }

  removeStudent(id: number) {
    /** Implementation here */
  }

  closeModal() {
    this.newStudentForm.reset();
    this.visible = false;
  }
}
